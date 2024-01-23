from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional, Dict, Union


class Token(BaseModel):
    access_token: str
    token_type: str