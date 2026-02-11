from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SkillBasedRecommender:
    def __init__(self, items):
        self.items = items
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2)
        )
        self.item_vectors = self.vectorizer.fit_transform(
            [item["text"] for item in items]
        )

    def recommend(self, skills, top_k=10):
        skill_text = " ".join(skills)
        skill_vector = self.vectorizer.transform([skill_text])
        scores = cosine_similarity(skill_vector, self.item_vectors)[0]
        indices = np.argsort(scores)[::-1][:top_k]

        return [
            {
                "id": self.items[i]["id"],
                "score": float(scores[i])
            }
            for i in indices
        ]
