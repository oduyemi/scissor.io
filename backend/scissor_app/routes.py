import os, random, string, qr_codes, qrcode, base64, hashlib
from datetime import timedelta, datetime
from fastapi import APIRouter, Request, status, Depends, HTTPException, Form
from fastapi.responses import StreamingResponse, RedirectResponse, FileResponse
from sqlalchemy.orm import Session
from scissor_app import starter, models, schemas
from typing import Optional, List
from scissor_app.models import URL, Visit, Contact
from .schemas import VisitResponse, ContactResponse, ContactRequest
from .dependencies import get_db
from io import BytesIO
from dotenv import load_dotenv
from instance.config import SECRET_KEY, DATABASE_URI
import smtplib
from email.mime.text import MIMEText


load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

if EMAIL_ADDRESS is None or EMAIL_PASSWORD is None:
    raise ValueError("EMAIL_ADDRESS and EMAIL_PASSWORD must be set in the environment.")



scissor_router = APIRouter()


def generate_short_url(length=6):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


def generate_qr_code_image(data: str, qr_codes_path: str = "qr_codes"):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    os.makedirs(qr_codes_path, exist_ok=True)
    
    url_hash = hashlib.md5(data.encode()).hexdigest()[:10]
    qr_code_path = os.path.join(qr_codes_path, f"{url_hash}.png")
    img.save(qr_code_path)

    return qr_code_path


def generate_qr_code(data: str, qr_codes_path: str = "qr_codes"):
    qr_image_path = generate_qr_code_image(data, qr_codes_path)
    
 
    with open(qr_image_path, "rb") as f:
        image_bytes = f.read()
    return StreamingResponse(content=image_bytes, media_type="image/png")


def send_email(to_email, subject, body):
    server = smtplib.SMTP('premium194.web-hosting.com', 465)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email

    server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())

    server.quit()


#   -   R  O  U  T  E  S   -

@starter.get("/")
async def get_index():
    return {"message": "Welcome to scissor.io"}


@starter.post("/shorten-url/", response_model=schemas.ShortenRequest)
def create_short_url(url: str, db: Session = Depends(get_db)):
    try:
        print(f"Received URL: {url}")
        hashed = hashlib.md5(url.encode())
        url_hash = base64.urlsafe_b64encode(hashed.digest()).decode('utf-8')[:10]
        db_url = db.query(URL).filter(URL.original_url == url).first()
        if db_url:
            return {
                "original_url": db_url.original_url,
                "shortened_url": db_url.shortened_url,
                "qr_code_path": db_url.qr_code_path,
                "visit_count": db_url.visit_count
            }
        else:
            short_url = generate_short_url()
            qr_code_path = generate_qr_code_image(url_hash)
            db_url = URL(original_url=url, shortened_url=short_url, qr_code_path=qr_code_path)
            db.add(db_url)
            db.commit()
            db.refresh(db_url)
            return {
                "original_url": url,
                "shortened_url": url_hash,
                "qr_code_path": qr_code_path,
                "visit_count": db_url.visit_count,
                "time": db_url.time
            }

    except Exception as e:
        print(f"Error: {e}")
        raise # HTTPException(status_code=422, detail=str(e)) 


@starter.get("/{short_url}", response_model=schemas.ShortenResponse)
def redirect_to_original(short_url: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.shortened_url == short_url).first()
    try:
        if url is None:
            raise HTTPException(status_code=404, detail="Shortened URL not found")

        url.visit_count += 1

        visit = Visit(short_url=short_url, time_shortened=url.id, visit_time=datetime.utcnow())
        db.add(visit)
        db.commit()

        return RedirectResponse(url.original_url)
    except Exception as e:
        print(f"Error: {e}")
        raise


@starter.get("/original-url/{short_url}", response_model=schemas.URLResponse)
def get_original_url(short_url: str, db: Session = Depends(get_db)):
        try:
            check = db.query(URL).filter(URL.shortened_url == short_url).first()

            if check:
                return {
                    "shortened_url": check.shortened_url,
                    "original_url": check.original_url
                }
            else:
                raise HTTPException(status_code=404, detail="Link is not valid")
        except Exception as e:
            print(f"Error: {e}")
            raise


@starter.get("/get-qr/{short_url}", response_model=List[schemas.QRResponse])
def get_qr_code(short_url: str, db: Session = Depends(get_db)):
    link = db.query(URL).filter(URL.shortened_url == short_url).first()
    try:
        if not link:
            raise HTTPException(status_code=404, detail="Link is not valid")

        qr_code_path = link.qr_code_path

        return FileResponse(qr_code_path, media_type="image/png")
    except Exception as e:
        print(f"Error: {e}")
        raise


@starter.get("/analytics/{short_url}", response_model=schemas.VisitResponse)
def get_analytics(short_url: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.shortened_url == short_url).first()
    try:
        if url is None:
            raise HTTPException(status_code=404, detail="Shortened URL not found")

        visits = db.query(Visit).filter(Visit.short_url == short_url).all()
        visit_times = [visit.visit_time for visit in visits]

        return VisitResponse(
            original_url=url.original_url,
            short_url=url.shortened_url,
            visit_times=[VisitDetail(visit_time=visit.visit_time) for visit in visits],
            visit_count=url.visit_count,
            visits=[VisitDetail(visit_time=visit.visit_time) for visit in visits]
        )
    except Exception as e:
        print(f"Error: {e}")
        raise



@starter.get("/contact/messages", response_model=List[schemas.ContactResponse])
def get_messages(db: Session = Depends(get_db)):
    responses = db.query(Contact).all()
    try:
        if not responses:
            raise HTTPException(status_code=404, detail="Messages not found")

        return [
            {
                "id": response.id,
                "name": response.name,
                "email": response.email,
                "message": response.message
            } 
            for response in responses
        ]
    except Exception as e:
        print(f"Error: {e}")
        raise


@starter.get("/contact/messages/{message_id}", response_model=schemas.ContactResponse)
def get_message(message_id: int, db: Session = Depends(get_db)):
    response = db.query(Contact).filter(Contact.id == message_id).first()
    try:
        if not response:
            raise HTTPException(status_code=404, detail="Message not found")

        return {
            "id": response.id,
            "name": response.name,
            "email": response.email,
            "message": response.message
        }
    except Exception as e:
        print(f"Error: {e}")
        raise


@starter.post("/send-message", response_model=ContactResponse)
def send_message(message: ContactRequest, db: Session = Depends(get_db)):
    current_datetime_utc = datetime.utcnow()
    try:
        db_message = Contact(
            name=message.name,
            email=message.email,
            message=message.message,
            date=current_datetime_utc
        )

        db.add(db_message)
        db.commit()
        db.refresh(db_message)

        send_email(message.email, "Your Message Received", "Your message has been received. We will get back to you shortly.")

        return db_message

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")