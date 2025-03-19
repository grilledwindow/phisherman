import confusable_homoglyphs.confusables
from flask import Flask, request, jsonify, render_template
import tldextract
import domains
from Levenshtein import distance
import confusable_homoglyphs
import requests
import urllib.parse
import whois
from datetime import datetime
import json


# Ollama
from ollama import chat
from pydantic import BaseModel


# Model output
class Output(BaseModel):
    # URL: str
    is_phishing_link: bool
    # description: str


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/gmail")
def gmail():
    return render_template("gmail.html")


@app.route("/check_url")
def check_url():
    url = request.args.get('url')
    scheme_score = None
    domain_score = None
    path_score = None
    reason = []
    expanded_url = expand_shortened_url(url)
    print(f"Original URL: {url} -> Expanded URL: {expanded_url}") 
    parsed_url = urllib.parse.urlparse(expanded_url)
    extracted = tldextract.extract(parsed_url.netloc)

    #defining scheme, domain and path of url
    scheme = parsed_url.scheme +'://'
    
    subdomain = extracted.subdomain

    if subdomain:
        subdomain +="."

    domain = extract_main_domain(expanded_url)
    path = parsed_url.path

    #scheme scoring system
    if scheme == "http://":
        scheme_score=0.5
    elif scheme =="https://":
        scheme_score=0
    else:
        scheme_score=1


    #domain scoring system
    homoglyph_result = check_homoglyph(expanded_url)
    if homoglyph_result:
        reason.append(homoglyph_result)
        domain_score = 1

    typosquatting_result = check_typosquat(expanded_url)
    if typosquatting_result and typosquatting_result == "Safe":
        domain_score = 0
    elif typosquatting_result:
        reason.append(typosquatting_result)
        domain_score = 1

    subdomain_spoofing_result = check_subdomain_spoofed(expanded_url)
    if subdomain_spoofing_result:
        reason.append(f'subdomain spoof:{subdomain_spoofing_result}')
        domain_score = 1 
    
    whois_result = get_whois(expanded_url)
    if whois_result:
        reason.append(whois_result)
    

    # if domain_score == None:
    #  TODO Reuben pls insert ML code here

    # else:
    # 
    
    
    data = [
        {"content": scheme , "type": "scheme", "score": scheme_score},
        {"content": subdomain + domain , "type": "domain", "score": domain_score},
        {"content": path , "type": "path", "score": path_score},
        {"content" :reason, "type": "reason"}
        # for debugging {"expanded" :expanded_url, "isshorten": is_shortened_url(url)}
    ]
    
    #convert to JavaScript formatting
    js_output = "const data = " + json.dumps(data, indent=4) + ";"

    return js_output

    


@app.route("/query_url", methods=["POST"])
def query_url():
    request_data = request.get_json()

    url = request_data["URL"]

    response = chat(
        messages=[
            {
                "role": "user",
                "content": f"Tell me if this link is a phishing link and tell me concisely what made this a phishing link in detail. link: {url}",
            }
        ],
        model="deepseek-r1:14b",
        format=Output.model_json_schema(),
    )

    result = Output.model_validate_json(
        response.message.content
    ).model_dump_json()

    # print(result)

    return result


# def check_embedded_url_in_query(url):
#     # Parse the URL and extract query parameters
#     parsed_url = urllib.parse.urlparse(url)
#     query_params = urllib.parse.parse_qs(parsed_url.query)

#     # Check if the 'url' parameter is present in the query
#     if "url" in query_params:
#         # Extract the embedded URL from the query parameter
#         embedded_url = query_params["url"][
#             0
#         ]  # Get the first value (assuming only one 'url' parameter)

#         # Run checks on the embedded URL

#         homoglyph_result = check_homoglyph(embedded_url)
#         if homoglyph_result:
#             return homoglyph_result

#         typosquatting_result = check_typosquat(embedded_url)
#         if typosquatting_result:
#             return typosquatting_result

#         subdomain_spoofing_result = check_subdomain_spoofed(embedded_url)
#         if subdomain_spoofing_result:
#             return subdomain_spoofing_result

#         return f"⚠️ Unsure: {embedded_url} (Not in trusted domains)"


def is_shortened_url(url):
    """Check if a URL belongs to a known shortening service."""
    extracted = tldextract.extract(url)
    return (
        f"{extracted.domain}.{extracted.suffix}" in domains.shortened_domains
    )


def expand_shortened_url(short_url):
    if not is_shortened_url(short_url):
        return short_url

    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        # Try HEAD first
        response = requests.head(short_url, headers=headers, allow_redirects=True, timeout=3)
        
        # If HEAD doesn't work properly, try GET
        if response.status_code >= 400 or response.url == short_url:
            response = requests.get(short_url, headers=headers, allow_redirects=True, timeout=5)

        return response.url  
    except requests.exceptions.RequestException:
        return short_url
    



def extract_main_domain(url):
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}"


def check_typosquat(url, threshold=2):
    
    domain = extract_main_domain(url)

    if domain in domains.trusted_domains:
        return "Safe"
    
    possible_typosquat_similarity_map = dict()

    for trusted in domains.trusted_domains:
        dist = distance(domain, trusted)
        if dist <= threshold:  # Small distance means similar typo
            possible_typosquat_similarity_map[trusted] = dist
    
    return possible_typosquat_similarity_map




# check for subdomain spoofing
def check_subdomain_spoofed(url):
    
    extracted = tldextract.extract(url) 
    subdomain = extracted.subdomain

    possible_spoofed_subdomains = []

    for trusted in domains.trusted_domains:
        trusted_base = trusted.split(".")[0]
        if trusted_base in subdomain.split("."):
            possible_spoofed_subdomains.append(trusted_base)

    return possible_spoofed_subdomains



def check_homoglyph(url):

    if bool(confusable_homoglyphs.confusables.is_dangerous(url)):

        characters = []
        confusable = confusable_homoglyphs.confusables.is_confusable(
            url, greedy=True, preferred_aliases=["latin"]
        )

        for item in confusable:
            characters.append(item["character"])

        return f"⚠️ homoglyph detected: {characters}"


# //simplier algo (escapes once 1 homoglyph character is detected)
# //less processing, might be more feasible if finding out all homoglyph char isn't neccessary

# if bool(confusable_homoglyphs.confusables.is_dangerous(url)):

#     character = confusable_homoglyphs.confusables.is_confusable(url, preferred_aliases=['latin'])[0]['character']

#     return f"⚠️ homoglyph detected: {character} in {url}"


def get_whois(domain):
    try:
        domain_info = whois.whois(domain)
        creation_date = domain_info.creation_date

        # Handle cases where creation_date might be a list
        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        # Ensure creation_date is a datetime object
        if isinstance(creation_date, datetime):
            domain_age_days = (datetime.now() - creation_date).days
            
            if domain_age_days < 90:
        
                return f"High Risk, domain is less than 90 days old."
            
        else:
            return {"whois": f"Creation date is not available"}

    except Exception as e:
        error_message = str(e)
        if "No match for" in error_message:
            return {"whois": f"domain does not exist."}
        else:
            return {"whois": f"WHOIS lookup failed: {error_message}"}
