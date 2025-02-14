import requests
import json




import requests
import json

# Replace this with your actual API key
API_KEY = "AIzaSyCoD7qrWmkXHu-S-Oju5MFc_Kh-8-9Gkh0"

def check_url_safety(url):
    api_url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={API_KEY}"
    
    payload = {
        "client": {
            "clientId": "yourcompany",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    response = requests.post(api_url, json=payload)
    result = response.json()

    if "matches" in result:
        return f"⚠️ WARNING: {url} is flagged as unsafe!"
    else:
        return f"✅ SAFE: {url} is not flagged."

# Example usage
print(check_url_safety("http://malicious-site.com"))
print(check_url_safety("https://google.com"))
print(check_url_safety("https://login.paypal.com"))  # False (Safe)
print(check_url_safety("https://paypal.scammer.com"))  # True (Spoofing)
print(check_url_safety("https://secure-paypal.com"))  # True (Spoofing)
