from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
import pandas as pd
import io
try:
    import PyPDF2
except Exception:
    PyPDF2 = None
try:
    import docx
except Exception:
    docx = None
try:
    import spacy
except Exception:
    spacy = None

nlp = None
if spacy:
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception as e:
        print(f"Warning: spacy model not found. Run python -m spacy download en_core_web_sm: {e}")
# Add the ML Models directory to path so we can import the model
# Using relative path assuming we run from 'Phase4_LLM_Frontend' or root
# Absolute path to be safe based on project structure
MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Phase2_ML_Models"))
sys.path.append(MODELS_DIR)

try:
    from job_recommendation_model import clean_job_data, extract_features, get_recommendations
except ImportError as e:
    print(f"Error importing model: {e}")
    # Fallback for development if paths are tricky
    print(f"Attempted to look in: {MODELS_DIR}")
    sys.exit(1)

app = FastAPI(title="SkillSync Job Recommendation API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold the model state
model_state = {
    "tfidf": None,
    "mlb": None,
    "embeddings": None,
    "df": None
}

class SkillsRequest(BaseModel):
    skills: list[str]

@app.on_event("startup")
async def load_model():
    """Load and train the model on startup."""
    print("Loading Job Recommendation Model...")
    
    # Path to the dataset and model
    # We use the same path logic as in the script
    data_path = os.path.join(MODELS_DIR, "job_postings_final.csv")
    
    # Model now lives in Phase 3
    # MODELS_DIR is .../Phase2_ML_Models
    # We need .../Phase3_Backend_APIs
    PHASE3_DIR = os.path.abspath(os.path.join(MODELS_DIR, "..", "Phase3_Backend_APIs"))
    
    if not os.path.exists(PHASE3_DIR):
        os.makedirs(PHASE3_DIR)
        
    model_path = os.path.join(PHASE3_DIR, "job_recommendation_model.pkl")
    
    try:
        # 1. Try Loading from Disk
        if os.path.exists(model_path):
            from job_recommendation_model import load_model_artifacts
            artifacts = load_model_artifacts(model_path)
            
            if artifacts:
                model_state["tfidf"] = artifacts["tfidf"]
                model_state["mlb"] = artifacts["mlb"]
                model_state["embeddings"] = artifacts["embeddings"]
                model_state["df"] = artifacts["df"]
                print("✅ Model loaded from disk successfully!")
                return
            else:
                print("⚠️  Model file exists but failed to load. Retraining...")
        else:
            print("ℹ️  No saved model found. Training from scratch...")

        # 2. Train if not loaded
        if not os.path.exists(data_path):
            print(f"WARNING: Data file not found at {data_path}. API will fail.")
            return

        # Clean Data
        df = clean_job_data(data_path)
        
        # Extract Features (Train the model)
        tfidf, mlb, embeddings = extract_features(df)
        
        # 3. Store in global state
        model_state["tfidf"] = tfidf
        model_state["mlb"] = mlb
        model_state["embeddings"] = embeddings
        model_state["df"] = df
        
        # 4. Save for next time
        if os.path.exists(MODELS_DIR):
            from job_recommendation_model import save_model_artifacts
            save_model_artifacts(model_path, tfidf, mlb, embeddings, df)
            print("💾 Model saved to disk.")
        
        print("✅ Model trained and loaded successfully!")
    except Exception as e:
        print(f"❌ Failed to load/train model: {e}")
        import traceback
        traceback.print_exc()

@app.get("/")
def read_root():
    return {"status": "SkillSync API is running"}

@app.post("/recommend")
def recommend_jobs(payload: SkillsRequest):
    """
    Get job recommendations based on user skills.
    Example payload: {"skills": ["python", "data analysis"]}
    """
    if model_state["tfidf"] is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    
    try:
        recommendations = get_recommendations(
            payload.skills,
            model_state["tfidf"],
            model_state["mlb"],
            model_state["embeddings"],
            model_state["df"]
        )
        return {"recommendations": recommendations}
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze_resume")
async def analyze_resume(
    resume_text: str = Form(None),
    resume_file: UploadFile = File(None)
):
    if model_state["tfidf"] is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
        
    text = ""
    if resume_text:
        text = resume_text
    elif resume_file:
        try:
            content = await resume_file.read()
            filename = resume_file.filename.lower()
            if filename.endswith(".pdf"):
                if PyPDF2:
                    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                else:
                    raise HTTPException(status_code=500, detail="PyPDF2 not installed")
            elif filename.endswith(".docx"):
                if docx:
                    doc = docx.Document(io.BytesIO(content))
                    for para in doc.paragraphs:
                        text += para.text + "\n"
                else:
                    raise HTTPException(status_code=500, detail="python-docx not installed")
            else:
                # Assume plain text
                text = content.decode("utf-8", errors="ignore")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading file: {e}")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="No resume content provided.")
        
    # Extract skills
    extracted_skills = []
    text_lower = text.lower()
    
    # Very basic tokenization
    tokens = [t.strip(",.()[]{}!?;:") for t in text_lower.split()]
    
    if model_state["mlb"]:
        known_skills = set(s.lower() for s in model_state["mlb"].classes_)
        # Find explicit substring matches
        for skill in known_skills:
            if skill in text_lower:
                extracted_skills.append(skill)
        
        extracted_skills = list(set(extracted_skills))
    
    if not extracted_skills:
        extracted_skills = ["Python", "Communication"] # default mock if none found
        
    try:
        from job_recommendation_model import get_recommendations
        raw_recs = get_recommendations(
            extracted_skills,
            model_state["tfidf"],
            model_state["mlb"],
            model_state["embeddings"],
            model_state["df"]
        )
        
        # 1. Summary (2 sentences)
        sentences = [s.strip() for s in text.replace('\\n', '. ').split('.') if s.strip()]
        summary = ". ".join(sentences[:2]) + "." if len(sentences) >= 2 else text[:200]
        if len(summary) < 20:
             summary = "Experienced professional with a diverse background. Looking for new opportunities to apply my skills."
             
        skill_gaps = []
        roadmap = []
        top_jobs = []
        top_role = "General Professional"
        match_score = "0%"
        
        if raw_recs:
            top_rec = raw_recs[0]
            top_role = top_rec["Job Title"]
            match_score = top_rec.get("Match Score", "85%")
            
            missing = top_rec.get("Missing Skills", [])
            if missing:
                # e.g., "[Power BI, Tableau -> 2 weeks learning]"
                skill_gaps = [f"[{', '.join(m.title() for m in missing)} → 2 weeks learning]"]
                
                # Roadmap
                for i, skill in enumerate(missing[:3]):
                    roadmap.append(f"Week {i+1}: {skill.title()}")
            else:
                skill_gaps = ["None -> You are a perfect fit!"]
                roadmap = ["Continue applying to top roles"]
                
            for rec in raw_recs[:2]:
                company = rec["Company"]
                top_jobs.append(f"{company} - <a href='#' class='apply-link'>Apply</a>")
                
        display_skills = [s.title() for s in extracted_skills[:10]]
        
        return {
            "summary": summary,
            "skills": display_skills,
            "top_role": f"{top_role} ({match_score} match)",
            "skill_gaps": skill_gaps,
            "top_jobs": top_jobs,
            "roadmap": roadmap
        }
        
    except Exception as e:
        print(f"Error generating recommendations for resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)
