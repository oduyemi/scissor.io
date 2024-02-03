from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List



class ShortenerRequest(BaseModel):
    original_url: str


class ShortenerResponse(BaseModel):
    original_url: str
    shortened_url:str
    qr_code_image: str

class CheckerResponse(BaseModel):
    shortened_url: str
    qr_code_image: str




class ShortenResponse(BaseModel):
    original_url: str
    shortened_url: str
    qr_code_path: Optional[str]
    visit_count: Optional[int]
    visit_time: Optional[datetime]

class Test(BaseModel):
    url: str


class URLRequest(BaseModel):
    id: Optional[int]
    original_url: str
    shortened_url: str
    qr_code_path: Optional[str]
    visit_count: Optional[int]
    visit_time: Optional[datetime]


class URLResponse(BaseModel):
    shortened_url: str
    original_url: str

class QRRequest(BaseModel):
    short_url: str

class QRResponse(BaseModel):
    qr_code_path: str


class VisitDetail(BaseModel):
    visit_time: datetime

class VisitResponse(BaseModel):
    original_url: str
    short_url: str
    visit_times: List[VisitDetail]
    visit_count: int
    visits: List[VisitDetail]



class ContactRequest(BaseModel):
    name: str
    email: str
    message: str
    sendCopy: bool

class ContactResponse(BaseModel):
    name: str
    email: str
    message: str