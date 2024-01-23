from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional, Dict, Union



class URLRequest(BaseModel):
    original_url: str
    shortened_url: str

class URLResponse(BaseModel):
    original_url: str
    shortened_url: str

class ShortenerRequest(BaseModel):
    shortened_url: str
    img: Optional[str]

class ShortenerResponse(BaseModel):
    shortened_url: str
    img: Optional[str]

class VisitRequest(BaseModel):
    short_url: str
    visit_time: Optional[datetime]

    class Config:
        orm_mode = True