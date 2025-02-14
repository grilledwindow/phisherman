import tldextract
from Levenshtein import distance



trusted_domains = ["paypal.com", "google.com", "microsoft.com", "facebook.com"]



def extract_main_domain(url):
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}"


def is_typosquatted(url, threshold=2):
    domain = extract_main_domain(url)

    #check if in trusted domain list
    if domain in trusted_domains:
        return f"✅ Safe: {url}"


    #Check for typosquatting
    for trusted in trusted_domains:
        if distance(domain, trusted) <= threshold:  # Small distance means similar typo
            return f"⚠️ Possible typosquatting detected: {url} (Did you mean {trusted}?)"
    
    return f"⚠️ Unsure: {url} (Not in trusted domains)" #


test_urls = [
    "https://secure-paypall.com/login",  # Typosquatting
    "https://paypal.com",                # Safe
    "https://faceboook.com",             # Typosquatting
    "https://google-secure.com",         # Typosquatting
    "https://microsoft.com",             # Safe
    "https://google.com",
    "https://login.paypal.com",          # False (Safe)
    "https://paypal.scammer.com",        # True (Spoofing)
    "https://secure-paypal.com",
    "https://dbs.com"          # True (Spoofing)
]

for url in test_urls:
    print("-------")
    print(extract_main_domain(url))
    print(is_typosquatted(url))
