import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer, normalize
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack
import joblib

# Data Cleaning
def clean_job_data(file_path):
    """Loads and standardizes raw job data as per Phase 1."""
    df = pd.read_csv(file_path)
    # Drop rows where critical info is missing
    df = df.dropna(subset=['Job Title', 'Required Skills']).copy()
    

    
    # Standardize skills into lowercase lists
    df['skills_list'] = df['Required Skills'].apply(
        lambda x: [s.strip().lower() for s in str(x).split(',')]
    )
    return df

# Data Preprocessing
def extract_features(df):
    """Converts text and skills into mathematical vectors using Sparse Matrices."""
    # Combine Job Title and Required Skills for context
    text_corpus = df['Job Title'] + " " + df['Required Skills']
    
    # TF-IDF for text features
    # IMPROVEMENT: Use ngram_range=(1, 2) to capture phrases like "Data Scientist"
    tfidf = TfidfVectorizer(stop_words='english', max_features=2000, ngram_range=(1, 2))
    text_features = tfidf.fit_transform(text_corpus)
    
    # Multi-hot encoding for Skills
    mlb = MultiLabelBinarizer()
    skill_features = mlb.fit_transform(df['skills_list'])
    
    # IMPROVEMENT: Weight skills higher than general text (2x importance)
    # This ensures that exact skill matches drive the recommendation more than generic text
    skill_features = skill_features.astype(float) * 2.0
    
    # Combine text and skill features using sparse-safe hstack
    combined = hstack([text_features, skill_features])
    
    # L2 Normalization ensures fair similarity matching
    normalized_embeddings = normalize(combined, norm='l2')
    
    return tfidf, mlb, normalized_embeddings

def get_recommendations(user_skills, tfidf, mlb, embeddings, df, top_k=5, location_code=""):
    """Matches user skills against the job database and identifies gaps, filtered by optional location."""
    
    # 1. Location Filtering
    if location_code:
        # Map frontend ISO country codes to dataset cities
        location_mapping = {
            "in": ["Bangalore"],
            "us": ["San Francisco", "New York"],
            "gb": ["London"],
            "ca": ["Toronto"],
            "au": ["Sydney"],
            "de": ["Berlin"]
        }
        
        valid_cities = location_mapping.get(location_code.lower())
        if valid_cities:
            # Create a boolean mask to filter rows
            mask = df['Location'].isin(valid_cities).values
            
            # If the mask has any True values, apply it
            if mask.any():
                df = df[mask].reset_index(drop=True)
                embeddings = embeddings[mask]
                
    # If df becomes empty or is empty, return early
    if df.empty or embeddings.shape[0] == 0:
        return []

    # 2. Preprocess user input
    user_skills_clean = [s.strip().lower() for s in user_skills]
    
    # Vectorize user input
    user_text_vec = tfidf.transform([" ".join(user_skills_clean)])
    user_skill_vec = mlb.transform([user_skills_clean])
    
    # Apply same weighting to user skills
    user_skill_vec = user_skill_vec.astype(float) * 2.0
    
    # Combine and normalize user vector
    user_combined = hstack([user_text_vec, user_skill_vec])
    user_vec = normalize(user_combined, norm='l2')
    
    # 3. Calculate Similarity Scores (Dot product of normalized vectors)
    scores = (embeddings @ user_vec.T).toarray().flatten()
    
    # Make sure we don't try to get top_k if there are fewer than top_k jobs
    actual_k = min(top_k, len(scores))
    if actual_k == 0:
        return []
        
    top_indices = scores.argsort()[-actual_k:][::-1]
    
    recommendations = []
    for idx in top_indices:
        job = df.iloc[idx]
        
        # Skill Gap Analysis: Identify missing skills for the user
        job_skills_set = set(job['skills_list'])
        user_skills_set = set(user_skills_clean)
        missing_skills = list(job_skills_set - user_skills_set)
        
        recommendations.append({
            "Job Title": job['Job Title'],
            "Company": job['Company'],
            "Match Score": f"{round(scores[idx] * 100, 1)}%",
            "Missing Skills": missing_skills[:3], # Suggest top 3 missing skills
            "Required Skills": job['skills_list'],  # Include all required skills for frontend
            "redirect_url": "#" # Placeholder so Apply Now button doesn't error out
        })
        
    return recommendations

def rank_live_jobs(user_skills, live_jobs, tfidf, mlb, top_k=5):
    """
    Ranks live jobs from Adzuna API based on user skills.
    
    Args:
        user_skills (list): List of user skills
        live_jobs (list): List of job dictionaries from Adzuna
        tfidf: Trained TfidfVectorizer
        mlb: Trained MultiLabelBinarizer
        top_k: Number of recommendations to return
    """
    if not live_jobs:
        return []

    # 1. Prepare User Vector
    user_skills_clean = [s.strip().lower() for s in user_skills]
    user_text_vec = tfidf.transform([" ".join(user_skills_clean)])
    user_skill_vec = mlb.transform([user_skills_clean])
    user_skill_vec = user_skill_vec.astype(float) * 2.0
    user_combined = hstack([user_text_vec, user_skill_vec])
    user_vec = normalize(user_combined, norm='l2')

    # 2. Process Live Jobs
    processed_jobs = []
    job_matrices = []
    
    known_skills = set(s.lower() for s in mlb.classes_)

    for job in live_jobs:
        # Extract fields from Adzuna format
        title = job.get('title', 'Unknown Title')
        company = job.get('company', {}).get('display_name', 'Unknown Company')
        description = job.get('description', '')
        redirect_url = job.get('redirect_url', '#')
        
        # Extract skills from description by matching against known_skills
        desc_lower = (title + " " + description).lower()
        extracted_skills = [skill for skill in known_skills if skill in desc_lower]
        if not extracted_skills:
            # Fallback if no specific skills found, use a default set or just the title
            extracted_skills = [] 

        # Vectorize job
        job_text_vec = tfidf.transform([title + " " + description])
        job_skill_vec = mlb.transform([extracted_skills])
        job_skill_vec = job_skill_vec.astype(float) * 2.0
        job_combined = hstack([job_text_vec, job_skill_vec])
        job_vec = normalize(job_combined, norm='l2')
        
        job_matrices.append(job_vec)
        
        # Store for later
        processed_jobs.append({
            "Job Title": title,
            "Company": company,
            "Description": description,
            "redirect_url": redirect_url,
            "Required Skills": extracted_skills,
            "skills_list": extracted_skills # for gap analysis consistency
        })

    if not job_matrices:
        return []

    # 3. Calculate Similarities
    # Stack all job vectors into one sparse matrix
    from scipy.sparse import vstack
    combined_job_embeddings = vstack(job_matrices)
    
    scores = (combined_job_embeddings @ user_vec.T).toarray().flatten()
    
    # 4. Rank and Format
    top_indices = scores.argsort()[-top_k:][::-1]
    
    recommendations = []
    for idx in top_indices:
        job = processed_jobs[idx]
        score = scores[idx]
        
        # Skill Gap Analysis
        job_skills_set = set(job['skills_list'])
        user_skills_set = set(user_skills_clean)
        missing_skills = list(job_skills_set - user_skills_set)
        
        recommendations.append({
            "Job Title": job['Job Title'],
            "Company": job['Company'],
            "Match Score": f"{round(score * 100, 1)}%",
            "Missing Skills": missing_skills[:3],
            "Required Skills": job['Required Skills'],
            "redirect_url": job['redirect_url'],
            "Description": job['Description']
        })
        
    return recommendations

def save_model_artifacts(filepath, tfidf, mlb, embeddings, df):
    """Saves the model artifacts to a single file using joblib."""
    artifacts = {
        "tfidf": tfidf,
        "mlb": mlb,
        "embeddings": embeddings,
        "df": df
    }
    joblib.dump(artifacts, filepath)
    print(f"Model artifacts saved to {filepath}")

def load_model_artifacts(filepath):
    """Loads model artifacts from a file."""
    if not os.path.exists(filepath):
        return None
    return joblib.load(filepath)

# --- EXECUTION ---
if __name__ == "__main__":
    # Path to your Phase 1 cleaned data
    DATA_PATH = "D:\Atharva engineering\PROJECTS\SkillSync all data\SkillSync\Phase1_Data_Design\job_postings_final.csv" 
    
    # Check if file exists, otherwise create dummy data for testing
    if not os.path.exists(DATA_PATH):
        pd.DataFrame({
            "Job Title": ["Data Scientist", "Frontend Developer"],
            "Company": ["TechCorp", "WebDesign"],
            "Required Skills": ["Python, SQL, Machine Learning", "JavaScript, React, CSS"]
        }).to_csv(DATA_PATH, index=False)

    # 1. Clean
    jobs_df = clean_job_data(DATA_PATH)
    
    # 2. Preprocess
    tfidf_model, mlb_model, job_vectors = extract_features(jobs_df)
    
    # 3. Save Model (Local Test)
    # Target Phase 3 directory
    # Assuming script is run from Phase2 or root, we try to locate Phase 3 relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to SkillSync, then into Phase3
    phase3_dir = os.path.abspath(os.path.join(script_dir, "..", "Phase3_Backend_APIs"))
    
    if not os.path.exists(phase3_dir):
        os.makedirs(phase3_dir)
        print(f"Created directory: {phase3_dir}")
        
    MODEL_PATH = os.path.join(phase3_dir, "job_recommendation_model.pkl")
    save_model_artifacts(MODEL_PATH, tfidf_model, mlb_model, job_vectors, jobs_df)
    
    # 4. Recommend (Example Input)
    user_input_skills = ["Social Media", "Content Writing", "SEO"]

    results = get_recommendations(user_input_skills, tfidf_model, mlb_model, job_vectors, jobs_df)

    print(f"\n-->Recommendations for skills: {user_input_skills}")
    for r in results:
        # Change 'Match_score' to 'Match Score' to match the dictionary key
        print(f"==> {r['Job Title']} at {r['Company']} | Match: {r['Match Score']}") 
        if r['Missing Skills']:
            print(f"   💡 Learn these to improve: {', '.join(r['Missing Skills'])}")

