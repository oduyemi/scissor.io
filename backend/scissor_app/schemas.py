from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional, Dict, Union


class URLModel(BaseModel):
    original_url: str
    shortened_url: str