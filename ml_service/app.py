from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
from recommender import SkillBasedRecommender

app = Flask(__name__)

# ✅ Proper CORS Configuration
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

print("🚀 Starting Flask app...")

# ===============================
# Load Model Files
# ===============================

BASE_DIR = os.path.dirname(__file__)
model_path = os.path.join(BASE_DIR, "resume_skill_model.joblib")
tfidf_path = os.path.join(BASE_DIR, "resume_tfidf_vectorizer.joblib")
binarizer_path = os.path.join(BASE_DIR, "resume_skill_binarizer.joblib")

print(f"📁 Looking for models in: {BASE_DIR}")
print(f"📄 resume_skill_model.joblib: {os.path.exists(model_path)}")
print(f"📄 resume_tfidf_vectorizer.joblib: {os.path.exists(tfidf_path)}")
print(f"📄 resume_skill_binarizer.joblib: {os.path.exists(binarizer_path)}")

if not all([os.path.exists(model_path), os.path.exists(tfidf_path), os.path.exists(binarizer_path)]):
    print("❌ MISSING MODEL FILES!")
    model = None
    tfidf = None
    binarizer = None
else:
    try:
        import joblib
        model = joblib.load(model_path)
        tfidf = joblib.load(tfidf_path)
        binarizer = joblib.load(binarizer_path)
        print("✅ Models loaded successfully")
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        model = None
        tfidf = None
        binarizer = None

# ===============================
# Resume Parser
# ===============================

@app.route("/parse_resume", methods=["POST"])
def parse_resume():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files allowed"}), 400

        reader = PyPDF2.PdfReader(file)
        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

        if not text.strip():
            return jsonify({"skills": []}), 200

        features = tfidf.transform([text])
        preds = model.predict(features)

        if isinstance(preds, tuple):
            preds = preds[0]

        skills_matrix = binarizer.inverse_transform(preds)

        if isinstance(skills_matrix, tuple):
            skills_matrix = skills_matrix[0]

        if hasattr(skills_matrix, "tolist"):
            skills = skills_matrix.tolist()
        else:
            skills = [list(row) for row in skills_matrix]

        final_skills = []
        for skill_list in skills:
            final_skills.extend([s for s in skill_list if s])

        return jsonify({"skills": final_skills})

    except Exception as e:
        print("❌ Resume parse error:", str(e))
        return jsonify({"error": str(e)}), 500


# ===============================
# Job Recommendation Route
# ===============================

@app.route("/recommend", methods=["POST"])
def recommend_jobs():
    try:
        print("🔥 /recommend hit")

        data = request.get_json() or {}
        jobs = data.get("jobs", [])
        skills = data.get("skills", [])

        if not jobs:
            return jsonify([])

        if not skills:
            return jsonify([
                {"id": job["_id"], "score": 0.0}
                for job in jobs
            ])

        items = [
            {
                "id": job["_id"],
                "text": f"{job.get('title','')} {job.get('description','')} {job.get('requirements','')}"
            }
            for job in jobs
        ]

        recommender = SkillBasedRecommender(items)
        recommendations = recommender.recommend(skills)

        print("✅ Recommendations:", recommendations)

        return jsonify(recommendations)

    except Exception as e:
        print("❌ Recommendation error:", str(e))
        return jsonify({"error": str(e)}), 500


# ===============================
# Run Server
# ===============================

if __name__ == "__main__":
    print("🌐 Starting server on http://127.0.0.1:5001")
    app.run(debug=True, port=5001)
