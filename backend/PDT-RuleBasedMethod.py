from flask import Flask, request, jsonify
import tldextract
from Levenshtein import distance


trusted_domains = ["paypal.com", "google.com", "microsoft.com", "facebook.com"]


def extract_main_domain(url):
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}"


def is_typosquatted(url, threshold=2):
    extracted = tldextract.extract(url)
    domain = extract_main_domain(url)

    #check if in trusted domain list
    if domain in trusted_domains:
        return f"✅ Safe: {url}"

    #Check for typosquatting
    for trusted in trusted_domains:
        if distance(domain, trusted) <= threshold:  # Small distance means similar typo
            return f"⚠️ Possible typosquatting detected: {url} (Did you mean {trusted}?)"
    
    
    

# check for subdomain spoofing
def is_subdomain_spoofed(url):
    extracted = tldextract.extract(url) 
    subdomain = extracted.subdomain

    for trusted in trusted_domains:
        trusted_base = trusted.split('.')[0]

        if trusted_base in subdomain.split('.'):

            return f"⚠️ Possible subdomain spoofing detected: {url} (Contains trusted name '{trusted_base}' in subdomain)"      

    

def analyse_url(url):

    typosquatting_result = is_typosquatted(url)
    if typosquatting_result:
        return typosquatting_result
    
    subdomain_spoofing_result = is_subdomain_spoofed(url)
    if subdomain_spoofing_result:
        return subdomain_spoofing_result
    
    return f"⚠️ Unsure: {url} (Not in trusted domains)"



test_urls = [

    "https://secure-paypall.com/login",  # Typosquatting
    "https://paypal.com",                # Safe
    "https://faceboook.com",             # Typosquatting
    "https://google-secure.com",         # Typosquatting
    "https://microsoft.com",             # Safe
    "https://google.login.com",
    "https://login.paypal.com",          # False (Safe)
    "https://paypal.scammer.com",        # True (Spoofing)
    "https://secure-paypal.com",
    "https://dbs.com",                   # True (Spoofing)
    "https://secure.paypal.com"
]


for url in test_urls:
    print("-------")
    print(analyse_url(url))


