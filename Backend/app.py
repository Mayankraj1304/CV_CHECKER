from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io

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
# ATS SCORE FUNCTION
# =========================

def calculate_ats_score(resume_text, job_description):

    # Convert both texts to lowercase
    resume_words = set(resume_text.lower().split())
    jd_words = set(job_description.lower().split())

    # Find matched keywords
    matched_keywords = resume_words.intersection(jd_words)

    # Find missing keywords
    missing_keywords = jd_words - resume_words

    # Calculate ATS Score
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

    # Read uploaded PDF file
    contents = await file.read()

    # Convert bytes into file-like object
    pdf_file = io.BytesIO(contents)

    extracted_text = ""

    # Open PDF using pdfplumber
    with pdfplumber.open(pdf_file) as pdf:

        # Loop through all pages
        for page in pdf.pages:

            # Extract text from page
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

    # Calculate ATS Score
    ats_result = calculate_ats_score(
        extracted_text,
        job_description
    )

    # Return response
    return {
        "filename": file.filename,
        "text": extracted_text,
        "ats_score": ats_result["score"],
        "matched_keywords": ats_result["matched_keywords"],
        "missing_keywords": ats_result["missing_keywords"]
    }