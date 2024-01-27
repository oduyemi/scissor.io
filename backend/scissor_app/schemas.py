from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


class ShortenRequest(BaseModel):
    original_url: str
    shortened_url: str
    qr_code_path: str
    visit_count: Optional[int]
    time: Optional[datetime]


class ShortenResponse(BaseModel):
    original_url: str
    shortened_url: str
    qr_code_path: Optional[str]
    visit_count: Optional[int]
    visit_time: Optional[datetime]


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
