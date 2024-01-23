from datetime import timedelta, datetime
from fastapi import APIRouter, Request, status, Depends, HTTPException, Form
from fastapi.responses import StreamingResponse, RedirectResponse
from sqlalchemy.orm import Session
from scissor_app import starter, models, schemas
from typing import Optional, List
from scissor_app.models import URL, QRCode
from .dependencies import get_db
import hashlib
import base64
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


#   -   R  O  U  T  E  S   -

@starter.get("/")
async def get_index():
    return {"message": "Welcome to scissor.io"}


@starter.post("/shorten-url/", response_model=schemas.URLRequest)
def create_short_url(url: str, qr: str, db: Session = Depends(get_db)):
    hashed = hashlib.md5(url.encode())
    url_hash = base64.urlsafe_b64encode(hashed.digest()).decode('utf-8')[:10]
    existing_url = db.query(URL).filter(URL.shortened_url == url_hash).first()

    if existing_url:
        raise HTTPException(status_code=400, detail="Short URL already exists")

    else:
        qr_code = generate_qr_code_image(url_hash)

        url_store = URL(original_url=url, shortened_url=url_hash)
        qr_store = QRCode(short_url=url_hash, image_path=qr_code)
        
        db.add(url_store)
        db.add(qr_store)
        db.commit()
    
    return {"original_url": url, "shortened_url": url_hash}


@starter.get("/{short_url}")
def redirect_to_original(short_url: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.shortened_url == short_url).first()
    if url is None:
        raise HTTPException(status_code=404, detail="Shortened URL not found")

    url.visit_count += 1

    visit = Visit(short_url=short_url)
    db.add(visit)
    db.commit()

    return RedirectResponse(url.original_url)


@starter.get("/original-url/{short_url}", response_model=schemas.URLResponse)
def get_original_url(short_url: str):
    check = db.query(URL).filter(short_url=shortened_url).first()
   
    if check:
        return {"Actual Domain": check.original_url}
    else:
        raise HTTPException(status_code=404, detail="Link is not valid")
        


@starter.get("/get-qr/{short_url}", response_model=List[schemas.ShortenerResponse])
def get_qr_code(short_url: str, db: Session = Depends(get_db)):
    link = db.query(QRCode).filter(short_url=shortened_url).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link is not valid")

    else:
        return {"Qr Code": link.short_url, "Image": link.image_path}


@starter.get("/analytics/{short_url}")
def get_analytics(short_url: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.shortened_url == short_url).first()
    if url is None:
        raise HTTPException(status_code=404, detail="Shortened URL not found")

    visits = db.query(Visit).filter(Visit.short_url == short_url).all()
    return {"original_url": url.original_url, "short_url": url.shortened_url, "visit_count": url.visit_count, "visits": visits}


