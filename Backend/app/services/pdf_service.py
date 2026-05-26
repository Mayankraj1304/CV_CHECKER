import io
import pdfplumber

def extract_text_from_pdf(file_contents: bytes) -> str:
    pdf_file = io.BytesIO(file_contents)
    extracted_text = ""
    
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
                
    return extracted_text