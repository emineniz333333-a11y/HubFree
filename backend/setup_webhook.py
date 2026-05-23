import os
import requests

def main():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    base_url = os.environ.get("WEBHOOK_BASE_URL")
    if not token or not base_url:
        print("❌ Missing TELEGRAM_BOT_TOKEN or WEBHOOK_BASE_URL")
        return

    webhook_url = f"{base_url}/bot"
    set_url = f"https://api.telegram.org/bot{token}/setWebhook"

    resp = requests.post(set_url, json={"url": webhook_url})
    print(resp.json())

if __name__ == "__main__":
    main()
