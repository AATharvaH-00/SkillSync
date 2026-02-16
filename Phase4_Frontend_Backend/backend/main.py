from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
import pandas as pd

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

if __name__ == "__main__":
    import uvicorn
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)
