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

model = SentenceTransformer("all-MiniLM-L6-v2")

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

def calculate_ats_score(resume_text, job_description):

    resume_words = set(
        re.findall(r'\b\w+\b', resume_text.lower())
    )

    jd_words = set(
        re.findall(r'\b\w+\b', job_description.lower())
    )

    matched_keywords = resume_words.intersection(jd_words)

    missing_keywords = jd_words - resume_words

    if len(jd_words) == 0:
        score = 0
    else:
        score = int((len(matched_keywords) / len(jd_words)) * 100)

    return {
        "score": score,
        "matched_keywords": list(matched_keywords),
        "missing_keywords": list(missing_keywords)
    }

# =========================
# AI SEMANTIC SIMILARITY
# =========================

def calculate_semantic_similarity(resume_text, job_description):

    resume_embedding = model.encode([resume_text])
    jd_embedding = model.encode([job_description])

    similarity = cosine_similarity(
        resume_embedding,
        jd_embedding
    )[0][0]

    score = float(
    max(
        0,
        min(round(similarity * 100, 2), 100)
    )
)

    return score

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