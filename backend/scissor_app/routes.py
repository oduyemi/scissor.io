from datetime import timedelta, datetime
from fastapi import APIRouter, Request, status, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from scissor_app import starter, models, schemas
from typing import Optional, List
from scissor_app.models import URL
from .schemas import URLModel
from .dependencies import get_db
from sqlalchemy import func
import qrcode
from io import BytesIO

scissor_router = APIRouter()


def generate_qr_code_image(data: str):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img_bytes = BytesIO()
    img.save(img_bytes)
    img_bytes.seek(0)

    return StreamingResponse(io=img_bytes, media_type="image/png")


@starter.get("/")
async def get_index():
    return {"message": "Welcome to scissor.io"}

@starter.post("/shorten-url/")
def create_short_url(url: URLModel):
    # Your logic to generate a short URL and store it in the database
    # Return the shortened URL
    pass
    return None

@starter.get("/original-url/{short_url}")
def get_original_url(short_url: str):
    # Your logic to retrieve the original URL from the database
    # Return the original URL
    pass
    return None

@starter.get("/generate-qr/{short_url}")
def generate_qr_code(short_url: str):
    # Your logic to generate a QR code for the given short URL
    # Return the QR code image or a link to download it
    pass
    return None


@starter.get("/analytics/{short_url}")
def get_analytics(short_url: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.shortened_url == short_url).first()
    if url is None:
        raise HTTPException(status_code=404, detail="Shortened URL not found")

    visits = db.query(Visit).filter(Visit.short_url == short_url).all()
    return {"original_url": url.original_url, "short_url": url.shortened_url, "visit_count": url.visit_count, "visits": visits}


@starter.get("/{short_url}")
def redirect_to_original(short_url: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.shortened_url == short_url).first()
    if url is None:
        raise HTTPException(status_code=404, detail="Shortened URL not found")

    # Increment visit count
    url.visit_count += 1

    # Log visit
    visit = Visit(short_url=short_url)
    db.add(visit)
    db.commit()

    # Redirect to original URL
    return RedirectResponse(url.original_url)