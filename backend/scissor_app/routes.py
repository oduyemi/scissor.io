import os, random, string, qr_codes, qrcode, base64, hashlib, io, validators, aiosmtplib, time, logging
from datetime import datetime
from cachetools import TTLCache, cached
from fastapi import APIRouter, Request, status, Depends, HTTPException, Form
from fastapi.responses import StreamingResponse, RedirectResponse, FileResponse, JSONResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session
from scissor_app import starter, models, schemas
from typing import Optional, List
from scissor_app.models import URL, Visit, Contact
from .schemas import VisitResponse, ContactResponse, ContactRequest, CheckerResponse, ShortenerRequest, QRResponse, VisitDetail
from .dependencies import get_db
from io import BytesIO
from dotenv import load_dotenv
from instance.config import SECRET_KEY, DATABASE_URI
from functools import wraps
from email.mime.text import MIMEText



load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

if EMAIL_ADDRESS is None or EMAIL_PASSWORD is None:
    raise ValueError("EMAIL_ADDRESS and EMAIL_PASSWORD must be set in the environment.")



scissor_router = APIRouter()

cache = TTLCache(maxsize=100, ttl=300)
logger = logging.getLogger(__name__)


# URL VALIDATOR
def validate_url(url):
    if url.startswith(('http://', 'https://')) or url.startswith('www.'):
        return True
    return False

# RATE LIMITER
def rate_limiter(max_requests: int, time_frame: int):
    def decorator(func):
        calls = []

        @wraps(func)
        async def wrapper(short_url: str, request: Request, *args, **kwargs):
            now = time.time()
            requests_in_timeframe = [r for r in calls if r > now - time_frame]

            if len(requests_in_timeframe) >= max_requests:
                raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded!")

            calls.append(now)
            return func(short_url, request, *args, **kwargs)

        return wrapper

    return decorator

# GENERATE SHORT URL
def generate_short_url(length=6):
    chars = (string.ascii_letters + string.digits).lower()
    return ''.join(random.choice(chars) for _ in range(length))

# QR CODE IMAGE
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
    img_bytes = io.BytesIO()
    img.save(img_bytes)
    img_bytes.seek(0)
    url_hash = hashlib.md5(data.encode()).hexdigest()[:10]
    qr_code_path = os.path.join(qr_codes_path, f"{url_hash}.png")
    img.save(qr_code_path)
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')

    return qr_code_path, img_base64

# QR CODE
def generate_qr_code(data: str, qr_codes_path: str = "qr_codes"):
    qr_image_path = generate_qr_code_image(data, qr_codes_path) 
    with open(qr_image_path, "rb") as f:
        image_bytes = f.read()
    return StreamingResponse(content=image_bytes, media_type="image/png")

# SEND EMAIL (CONTACT)
async def send_email_async(to_email, subject, body):
    from_email = EMAIL_ADDRESS
    password = EMAIL_PASSWORD
    smtp_server = 'premium194.web-hosting.com', 465

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email

    async with aiosmtplib.SMTP(hostname=smtp_server, port=465, use_tls=True) as smtp:
        await smtp.login(from_email, password)
        await smtp.send_message(msg)





#     -     R   O   U   T   E   S     -

@starter.get("/")
async def get_index():
    return {"message": "Scissor!"}


@starter.post("/shorten-url", response_model=schemas.ShortenerResponse)
def create_short_url(request: ShortenerRequest, db: Session = Depends(get_db)):
    try:
        url = request.original_url
        print(f"Received URL: {url}")
        if not validate_url(url):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid URL")

        hashed = hashlib.md5(url.encode())
        url_hash = base64.urlsafe_b64encode(hashed.digest()).decode('utf-8')[:10]
        
        db_url = db.query(URL).filter(URL.original_url == url).first()
        if db_url:
            return {
                "original_url": db_url.original_url,
                "shortened_url": db_url.shortened_url,
                "qr_code_image": db_url.qr_code_path 
            }

        else:
            short_url = generate_short_url()
            qr_code_path, qr_code_image = generate_qr_code_image(url_hash)

            db_url = URL(
                original_url = url,
                shortened_url = short_url,
                qr_code_path = qr_code_path,
            )
            db.add(db_url)
            db.commit()
            db.refresh(db_url)
            return {
                "original_url": db_url.original_url,
                "shortened_url": db_url.shortened_url,
                "qr_code_image": qr_code_image
            }

    except (HTTPException, Exception) as e:
        logger.error(f"Error: {e}")
        raise


@starter.get("/{short_url}", response_model=schemas.ShortenResponse)
@rate_limiter(max_requests=5, time_frame=60)
@cached(cache)
def redirect_to_original(short_url: str, request: Request, db: Session = Depends(get_db)):
    try:
        print(f"Received Shortened URL: {short_url}")
        url = db.query(URL).filter(or_(URL.shortened_url == short_url, URL.original_url == short_url)).first()

        if url is None:
            raise HTTPException(status_code=404, detail="Shortened URL not found")

        # Increment visit count
        url.visit_count += 1

        # Visit record
        visit = Visit(
            short_url=short_url,
            time_shortened=url.id,
            visit_time=datetime.utcnow()
        )
        db.add(visit)
        db.commit()

        # Refactor url to use https protocol
        link = url.original_url
        if link.startswith("www."):
            link = "https://" + link
        
        print(f"Redirecting to original URL: {link}")

        # Redirect
        return RedirectResponse(link)

    except (HTTPException, Exception) as e:
        logger.error(f"Error: {e}")
        raise


@starter.get("/get-qr/{short_url}", response_model=schemas.QRResponse)
@rate_limiter(max_requests=10, time_frame=60)
@cached(cache)
def get_qr_code(short_url: str, request: Request, db: Session = Depends(get_db)):
    try:
        print(f"Received URL: {short_url}")
        cached_result = cache.get(short_url.lower())
        if cached_result:
            return cached_result

        link = db.query(URL).filter(URL.shortened_url == short_url).first()

        if not link:
            raise HTTPException(status_code=404, detail="Link is not valid")

        qr_code_path = link.qr_code_path

        cache[short_url] = qr_code_path

        return FileResponse(qr_code_path)

    except Exception as e:
        print(f"Error: {e}")
        raise


@starter.get("/original-url/{short_url}", response_model=schemas.URLResponse)
@cached(cache)
def get_original_url(short_url: str, db: Session = Depends(get_db)):
    try:
        cached_result = cache.get(short_url)
        if cached_result:
            return cached_result

        check = db.query(URL).filter(URL.shortened_url == short_url).first()

        if check:
            response = {
                "shortened_url": check.shortened_url,
                "original_url": check.original_url
            }

            cache[short_url] = response

            return response
        else:
            raise HTTPException(status_code=404, detail="Link is not valid")

    except (HTTPException, Exception) as e:
        logger.error(f"Error: {e}")
        raise 




@starter.get("/analytics/{short_url}", response_model=schemas.VisitResponse)
def get_analytics(short_url: str, request: Request, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received URL: {short_url}")
        url = db.query(URL).filter(URL.shortened_url == short_url).first()

        if url is None:
            raise HTTPException(status_code=404, detail="Shortened URL not found")

        visits = db.query(Visit).filter(Visit.short_url == short_url).all()

        response_model = VisitResponse(
            original_url=url.original_url,
            short_url=url.shortened_url,
            visit_times=[VisitDetail(visit_time=visit.visit_time) for visit in visits],
            visit_count=url.visit_count,
            visits=[VisitDetail(visit_time=visit.visit_time) for visit in visits]
        )

        return response_model

    except HTTPException as e:
        logger.error(f"HTTP Exception: {e}")
        raise
    except Exception as e:
        logger.error(f"Error: {e}")
        raise



@starter.get("/contact/messages", response_model=List[schemas.ContactResponse])
@cached(cache)
@rate_limiter(max_requests=10, time_frame=60)
def get_messages(db: Session = Depends(get_db)):
    try:
        cached_result = cache.get("all_messages")
        if cached_result:
            return cached_result

        responses = db.query(Contact).all()

        if not responses:
            raise HTTPException(status_code=404, detail="Messages not found")

        response_data = [
            {
                "id": response.id,
                "name": response.name,
                "email": response.email,
                "message": response.message
            }
            for response in responses
        ]

        cache["all_messages"] = response_data

        return response_data

    except (HTTPException, Exception) as e:
        logger.error(f"Error: {e}")
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
    except (HTTPException, Exception) as e:
        logger.error(f"Error: {e}")
        raise 


@starter.post("/send-message", response_model=ContactResponse)
async def send_message(message: ContactRequest, db: Session = Depends(get_db)):
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

        await send_email_async(message.email, "Your Message Received", "Your message has been received. We will get back to you shortly.")

        return {"message": "Your message has been received. We will get back to you shortly."}

    except (HTTPException, Exception) as e:
        logger.error(f"Error: {e}")
        raise