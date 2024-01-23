from datetime import timedelta, datetime
from fastapi import APIRouter, Request, status, Depends, HTTPException, Form
from sqlalchemy.orm import Session, joinedload
from scissor_app import starter, models, schemas
from typing import Optional, List
from scissor_app.models import URL
from .schemas import URLModel
from sqlalchemy import func

scissor_router = APIRouter()



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