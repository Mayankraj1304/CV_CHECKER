import re
import math
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from app.config import settings

# Initialize model based on configuration
model = SentenceTransformer(settings.MODEL_NAME)

STOP_WORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by',
    'for', 'from', 'has', 'have', 'he', 'in', 'is',
    'it', 'its', 'of', 'on', 'or', 'that', 'the',
    'to', 'was', 'were', 'will', 'with'
}

def split_sentences(text: str) -> list[str]:
    return [sentence.strip() for sentence in re.split(r'(?<=[.!?])\s+', text) if sentence.strip()]

def calculate_ats_score(resume_text: str, job_description: str) -> dict:
    resume_words = set(re.findall(r'\b\w+\b', resume_text.lower()))
    jd_words = set(re.findall(r'\b\w+\b', job_description.lower()))

    resume_words = {w for w in resume_words if w not in STOP_WORDS and len(w) > 2 and w.isalpha()}
    jd_words = {w for w in jd_words if w not in STOP_WORDS and len(w) > 2 and w.isalpha()}

    matched_keywords = resume_words.intersection(jd_words)
    missing_keywords = jd_words - resume_words

    score = 0 if len(jd_words) == 0 else int((len(matched_keywords) / len(jd_words)) * 100)

    return {
        "score": score,
        "matched_keywords": sorted(list(matched_keywords)),
        "missing_keywords": sorted(list(missing_keywords))
    }

def calculate_semantic_similarity(resume_text: str, job_description: str) -> float:
    resume_sentences = split_sentences(resume_text)
    jd_sentences = split_sentences(job_description)
    
    resume_sentences = [s for s in resume_sentences if len(s.split()) >= 5]
    jd_sentences = [s for s in jd_sentences if len(s.split()) >= 5]

    if not resume_sentences or not jd_sentences:
        return 0.0

    resume_embeddings = model.encode(resume_sentences)
    jd_embeddings = model.encode(jd_sentences)

    similarity_matrix = cosine_similarity(resume_embeddings, jd_embeddings)
    best_matches = similarity_matrix.max(axis=0)

    raw_score = float(best_matches.mean())
    centered = (raw_score - 0.35) * 10
    sigmoid = 1 / (1 + math.exp(-centered))
    
    return round(sigmoid * 100, 2)
