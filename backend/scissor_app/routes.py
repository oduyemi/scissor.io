from datetime import timedelta, datetime
from fastapi import APIRouter, Request, status, Depends, HTTPException, Form
from sqlalchemy.orm import Session, joinedload
from scissor_app import starter, models, schemas
from scissor_app.dependencies import get_db, get_current_user
from scissor_app.authorize import decode_token, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional, List
# from scissor_app.models import Program, Class, Student, Admission, Role, Staff, Department
from sqlalchemy import func

scissor_router = APIRouter()


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')
