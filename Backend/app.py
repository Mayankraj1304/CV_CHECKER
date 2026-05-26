# backend/app.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io
import re

# AI Libraries
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# =========================
# LOAD AI MODEL
# =========================

model = SentenceTransformer("all-mpnet-base-v2")

app = FastAPI()

# =========================
# CORS CONFIGURATION
# =========================

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# KEYWORD ATS SCORE
# =========================

STOP_WORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by',
    'for', 'from', 'has', 'have', 'he', 'in', 'is',
    'it', 'its', 'of', 'on', 'or', 'that', 'the',
    'to', 'was', 'were', 'will', 'with'
}

def calculate_ats_score(resume_text, job_description):
    resume_words = set(
        re.findall(r'\b\w+\b', resume_text.lower())
    )

    jd_words = set(
        re.findall(r'\b\w+\b', job_description.lower())
    )

    # Remove stop words and non-alphabet words
    resume_words = {
        w for w in resume_words
        if (
            w not in STOP_WORDS
            and len(w) > 2
            and w.isalpha()
        )
    }

    jd_words = {
        w for w in jd_words
        if (
            w not in STOP_WORDS
            and len(w) > 2
            and w.isalpha()
        )
    }

    matched_keywords = resume_words.intersection(jd_words)
    missing_keywords = jd_words - resume_words

    if len(jd_words) == 0:
        score = 0
    else:
        score = int(
            (len(matched_keywords) / len(jd_words)) * 100
        )

    return {
        "score": score,
        "matched_keywords": sorted(list(matched_keywords)),
        "missing_keywords": sorted(list(missing_keywords))
    }

# =========================
# AI SEMANTIC SIMILARITY
# =========================

def calculate_semantic_similarity(resume_text, job_description):
    # Use sentence-level chunking, not line-level
    import nltk
    resume_sentences = nltk.sent_tokenize(resume_text)
    jd_sentences = nltk.sent_tokenize(job_description)
    
    # Filter noise — minimum 5 words
    resume_sentences = [s for s in resume_sentences if len(s.split()) >= 5]
    jd_sentences = [s for s in jd_sentences if len(s.split()) >= 5]

    resume_embeddings = model.encode(resume_sentences)
    jd_embeddings = model.encode(jd_sentences)

    similarity_matrix = cosine_similarity(resume_embeddings, jd_embeddings)
    best_matches = similarity_matrix.max(axis=0)

    # Dynamic normalization — don't hardcode bounds
    raw_score = float(best_matches.mean())
    
    # Scale using actual model range for this task (empirically ~0.2–0.7)
    # Apply a sigmoid-like curve instead of linear clamp
    import math
    centered = (raw_score - 0.35) * 10   # center around 0.35
    sigmoid = 1 / (1 + math.exp(-centered))
    final_score = round(sigmoid * 100, 2)
    
    return final_score

# =========================
# HOME ROUTE
# =========================

@app.get("/")
def home():
    return {"message": "Backend is running"}

# =========================
# UPLOAD ROUTE
# =========================

@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Read uploaded file
    contents = await file.read()

    # Convert bytes into file object
    pdf_file = io.BytesIO(contents)

    extracted_text = ""

    # Open PDF
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

    # Handle empty extraction
    if extracted_text.strip() == "":
        return {
            "error": "No text could be extracted from PDF"
        }

    # =========================
    # ATS SCORE
    # =========================
    ats_result = calculate_ats_score(
        extracted_text,
        job_description
    )

    # =========================
    # AI SEMANTIC SCORE
    # =========================
    semantic_score = calculate_semantic_similarity(
        extracted_text,
        job_description
    )

    # =========================
    # RESPONSE
    # =========================
    return {
        "filename": file.filename,
        "text": extracted_text,
        "ats_score": ats_result["score"],
        "semantic_score": semantic_score,
        "matched_keywords": ats_result["matched_keywords"],
        "missing_keywords": ats_result["missing_keywords"]
    }