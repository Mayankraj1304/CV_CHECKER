from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_service import extract_text_from_pdf
from app.services.nlp_service import calculate_ats_score, calculate_semantic_similarity

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Backend is running"}

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    contents = await file.read()
    extracted_text = extract_text_from_pdf(contents)

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from PDF")

    ats_result = calculate_ats_score(extracted_text, job_description)
    semantic_score = calculate_semantic_similarity(extracted_text, job_description)

    return {
        "filename": file.filename,
        "text": extracted_text,
        "ats_score": ats_result["score"],
        "semantic_score": semantic_score,
        "matched_keywords": ats_result["matched_keywords"],
        "missing_keywords": ats_result["missing_keywords"]
    }