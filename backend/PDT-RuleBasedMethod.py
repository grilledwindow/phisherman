
from flask import Flask, Request, jsonify, render_template
import tldextract
from trusted_domains import trusted_domains
from Levenshtein import distance

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('gmail.html')


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






# @app.route('/check-url', methods=["GET", "POST"])
def check_url(url):
    # data = request.json
    # url = data.get('url')

    # if not url:
    #     return jsonify({"Error": "URL is required"}), 400

    typosquatting_result = is_typosquatted(url)
    if typosquatting_result:
        return typosquatting_result
    
    subdomain_spoofing_result = is_subdomain_spoofed(url)
    if subdomain_spoofing_result:
        return subdomain_spoofing_result
    


    
    return f"⚠️ Unsure: {url} (Not in trusted domains)"
    #return jsonify({f"⚠️ Unsure: {url} (Not in trusted domains)"})

# if __name__ == '__main__':
#     app.run(debug=True)

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
    "https://secure.paypal.com",
    "https://zicotrust.com",
    "https://z1cotrust.com",
    "https://www.uobgroup.com/uobgroup/newsroom/index.page"

]


for url in test_urls:
    print("-------")
    print(check_url(url))


