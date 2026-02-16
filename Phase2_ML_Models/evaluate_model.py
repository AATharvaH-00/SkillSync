"""
Standalone Model Evaluation Script
Evaluates the job recommendation model with proper recommendation metrics
"""
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer, normalize
from scipy.sparse import hstack

# ======================== DATA PREPARATION ========================
def create_test_dataset():
    """Creates a larger test dataset with ground truth labels."""
    
    jobs_data = {
        "Job Title": [
            "Data Scientist",
            "Machine Learning Engineer", 
            "Frontend Developer",
            "Full Stack Developer",
            "Digital Marketing Manager",
            "Content Writer",
            "Social Media Manager",
            "Backend Developer",
            "DevOps Engineer",
            "UI/UX Designer",
            "Product Manager",
            "Business Analyst",
            "Data Analyst",
            "Marketing Coordinator",
            "SEO Specialist"
        ],
        "Company": [
            "TechCorp", "AI Solutions", "WebDesign", "StartupXYZ", "MarketingPro",
            "ContentHub", "SocialBuzz", "CloudSystems", "InfraCo", "DesignStudio",
            "ProductInc", "ConsultCorp", "DataInsights", "BrandAgency", "SearchMasters"
        ],
        "Required Skills": [
            "Python, SQL, Machine Learning, Statistics, Data Visualization",
            "Python, TensorFlow, PyTorch, Deep Learning, MLOps",
            "JavaScript, React, CSS, HTML, TypeScript",
            "JavaScript, Node.js, React, MongoDB, Express",
            "Marketing Strategy, Social Media, SEO, Content Marketing, Analytics",
            "Content Writing, SEO, Research, Editing, WordPress",
            "Social Media, Content Creation, Analytics, Community Management",
            "Python, Django, PostgreSQL, REST API, Docker",
            "AWS, Kubernetes, CI/CD, Docker, Terraform",
            "Figma, Adobe XD, Prototyping, User Research, Wireframing",
            "Product Strategy, Agile, Stakeholder Management, Market Research",
            "SQL, Excel, Business Intelligence, Data Analysis, Tableau",
            "SQL, Python, Excel, Data Visualization, Statistics",
            "Content Marketing, Social Media, Email Marketing, Analytics",
            "SEO, Google Analytics, Keyword Research, Content Optimization"
        ]
    }
    
    # Ground truth: Manually labeled relevant jobs for each user profile
    ground_truth = {
        "Data Science Profile": {
            "skills": ["Python", "SQL", "Machine Learning", "Statistics"],
            "relevant_jobs": [0, 1, 12]  # Data Scientist, ML Engineer, Data Analyst
        },
        "Web Development Profile": {
            "skills": ["JavaScript", "React", "CSS", "HTML"],
            "relevant_jobs": [2, 3]  # Frontend Dev, Full Stack Dev
        },
        "Marketing Profile": {
            "skills": ["Social Media", "Content Writing", "SEO"],
            "relevant_jobs": [4, 5, 6, 13, 14]  # Marketing roles
        },
        "Backend Profile": {
            "skills": ["Python", "Django", "PostgreSQL", "REST API"],
            "relevant_jobs": [7, 3]  # Backend Dev, Full Stack Dev
        },
        "Design Profile": {
            "skills": ["Figma", "Adobe XD", "UI Design", "Prototyping"],
            "relevant_jobs": [9]  # UI/UX Designer
        }
    }
    
    return pd.DataFrame(jobs_data), ground_truth


# ======================== MODEL TRAINING ========================
def train_model(df):
    """Train the recommendation model (Mirroring job_recommendation_model.py)."""
    # Clean data
    df = df.dropna(subset=['Job Title', 'Required Skills']).copy()
    df['skills_list'] = df['Required Skills'].apply(
        lambda x: [s.strip().lower() for s in str(x).split(',')]
    )
    
    # Extract features
    text_corpus = df['Job Title'] + " " + df['Required Skills']
    
    # IMPROVEMENT: Use ngram_range=(1, 2)
    tfidf = TfidfVectorizer(stop_words='english', max_features=2000, ngram_range=(1, 2))
    text_features = tfidf.fit_transform(text_corpus)
    
    mlb = MultiLabelBinarizer()
    skill_features = mlb.fit_transform(df['skills_list'])
    
    # IMPROVEMENT: Weight skills higher (2x importance)
    skill_features = skill_features.astype(float) * 2.0
    
    combined = hstack([text_features, skill_features])
    embeddings = normalize(combined, norm='l2')
    
    return tfidf, mlb, embeddings, df


# ======================== EVALUATION METRICS ========================
def precision_at_k(recommended, relevant, k):
    """Precision@K: % of recommendations that are relevant"""
    top_k = recommended[:k]
    return len(set(top_k) & set(relevant)) / k if k > 0 else 0


def recall_at_k(recommended, relevant, k):
    """Recall@K: % of relevant items that were recommended"""
    top_k = recommended[:k]
    return len(set(top_k) & set(relevant)) / len(relevant) if len(relevant) > 0 else 0


def f1_at_k(precision, recall):
    """F1 Score: Harmonic mean of precision and recall"""
    if precision + recall == 0:
        return 0
    return 2 * (precision * recall) / (precision + recall)


def ndcg_at_k(recommended, relevant, k):
    """NDCG@K: Normalized Discounted Cumulative Gain (ranking quality)"""
    dcg = sum([1 / np.log2(i + 2) for i, idx in enumerate(recommended[:k]) if idx in relevant])
    idcg = sum([1 / np.log2(i + 2) for i in range(min(len(relevant), k))])
    return dcg / idcg if idcg > 0 else 0


def mrr(recommended, relevant):
    """MRR: Mean Reciprocal Rank (position of first relevant item)"""
    for i, idx in enumerate(recommended):
        if idx in relevant:
            return 1 / (i + 1)
    return 0


# ======================== MAIN EVALUATION ========================
def evaluate():
    print("\n" + "="*80)
    print("JOB RECOMMENDATION MODEL - ACCURACY EVALUATION")
    print("="*80)
    
    print("\n📌 UNDERSTANDING RECOMMENDATION METRICS:")
    print("-" * 80)
    print("❌ Traditional 'accuracy' doesn't apply to recommendation systems!")
    print("✅ Instead, we use these metrics:\n")
    print("   • Precision@K: What % of top K recommendations are actually relevant?")
    print("   • Recall@K: What % of all relevant jobs did we find in top K?")
    print("   • F1@K: Balance between precision and recall")
    print("   • NDCG@K: Ranking quality (0-1, higher = better ranking)")
    print("   • MRR: How quickly do we show a relevant job? (higher = better)")
    print("-" * 80)
    
    # Create test data
    print("\n📊 Creating test dataset...")
    jobs_df, ground_truth = create_test_dataset()
    print(f"✅ Dataset created: {len(jobs_df)} job postings")
    
    # Train model
    print("🔧 Training recommendation model...")
    tfidf, mlb, embeddings, jobs_df = train_model(jobs_df)
    print("✅ Model trained successfully")
    
    # Evaluate
    all_results = []
    
    for profile_name, data in ground_truth.items():
        user_skills = data["skills"]
        relevant_jobs = data["relevant_jobs"]
        
        print(f"\n\n{'='*80}")
        print(f"🎯 TESTING: {profile_name}")
        print(f"{'='*80}")
        print(f"User Skills: {', '.join(user_skills)}")
        print(f"Expected Relevant Jobs: {len(relevant_jobs)}")
        print("-" * 80)
        
        # Get recommendations
        user_skills_clean = [s.strip().lower() for s in user_skills]  # Improved cleaning
        user_text_vec = tfidf.transform([" ".join(user_skills_clean)])
        user_skill_vec = mlb.transform([user_skills_clean])
        
        # IMPROVEMENT: Apply same weighting to user skills
        user_skill_vec = user_skill_vec.astype(float) * 2.0
        
        user_combined = hstack([user_text_vec, user_skill_vec])
        user_vec = normalize(user_combined, norm='l2')
        
        scores = (embeddings @ user_vec.T).toarray().flatten()
        recommended_indices = scores.argsort()[::-1].tolist()
        
        # Calculate metrics
        for k in [3, 5, 10]:
            p = precision_at_k(recommended_indices, relevant_jobs, k)
            r = recall_at_k(recommended_indices, relevant_jobs, k)
            f = f1_at_k(p, r)
            n = ndcg_at_k(recommended_indices, relevant_jobs, k)
            
            all_results.append({
                "Profile": profile_name,
                "K": k,
                "Precision": round(p, 3),
                "Recall": round(r, 3),
                "F1": round(f, 3),
                "NDCG": round(n, 3)
            })
            
            print(f"\n📈 @ K={k}:")
            print(f"   Precision: {p:.3f} ({p*100:.1f}% relevant)")
            print(f"   Recall:    {r:.3f} ({r*100:.1f}% captured)")
            print(f"   F1:        {f:.3f}")
            print(f"   NDCG:      {n:.3f}")
        
        # MRR
        m = mrr(recommended_indices, relevant_jobs)
        print(f"\n   MRR: {m:.3f} (1st relevant at position #{int(1/m) if m > 0 else 'N/A'})")
        
        # Show recommendations
        print(f"\n   🔍 Top 5 Recommendations:")
        for i, idx in enumerate(recommended_indices[:5], 1):
            job = jobs_df.iloc[idx]
            mark = "✅" if idx in relevant_jobs else "❌"
            print(f"      {i}. {mark} {job['Job Title']} @ {job['Company']} | Score: {scores[idx]:.3f}")
    
    # Overall stats
    df_results = pd.DataFrame(all_results)
    
    print(f"\n\n{'='*80}")
    print("📊 OVERALL MODEL PERFORMANCE")
    print(f"{'='*80}")
    
    for k in [3, 5, 10]:
        subset = df_results[df_results['K'] == k]
        print(f"\n@ K={k} (averaged across all test profiles):")
        print(f"   Avg Precision: {subset['Precision'].mean():.3f} ⭐")
        print(f"   Avg Recall:    {subset['Recall'].mean():.3f} ⭐")
        print(f"   Avg F1:        {subset['F1'].mean():.3f} ⭐")
        print(f"   Avg NDCG:      {subset['NDCG'].mean():.3f} ⭐")
    
    print("\n" + "="*80)
    print("✅ EVALUATION COMPLETE!")
    print("="*80)
    print("\n💡 INTERPRETATION:")
    print("   • Precision ~0.6-0.8 = Good (most recommendations are relevant)")
    print("   • Recall ~0.6-0.8 = Good (we're finding most relevant jobs)")
    print("   • NDCG ~0.7-0.9 = Good (relevant jobs are ranked high)")
    print("="*80 + "\n")
    
    # Save results
    df_results.to_csv("evaluation_metrics.csv", index=False)
    print("💾 Results saved to: evaluation_metrics.csv\n")
    
    return df_results


if __name__ == "__main__":
    evaluate()
