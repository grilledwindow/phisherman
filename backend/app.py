from flask import Flask, request, jsonify, render_template
import tldextract
import domains
from Levenshtein import distance
import confusable_homoglyphs
import requests
import urllib.parse

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

    if not url:
        return {"error": "URL is required"}, 400
    
    expanded_url = expand_shortened_url(url)

    extracted = tldextract.extract(url)
    embedded_check_result = check_embedded_url_in_query(expanded_url)
    homoglyph_results = check_homoglyph(expanded_url)
    typosquat_results = check_typosquat(f"{extracted.domain}.{extracted.suffix}")
    spoof_results = check_subdomain_spoofed(extracted.subdomain)

    return {"embedded_url":embedded_check_result, "homoglyph" : homoglyph_results, "typosquat": typosquat_results, "spoof": spoof_results}, 200


def check_embedded_url_in_query(url):
    # Parse the URL and extract query parameters
    parsed_url = urllib.parse.urlparse(url)
    query_params = urllib.parse.parse_qs(parsed_url.query)
    
    # Check if the 'url' parameter is present in the query
    if 'url' in query_params:
        # Extract the embedded URL from the query parameter
        embedded_url = query_params['url'][0]  # Get the first value (assuming only one 'url' parameter)
        
        # Run checks on the embedded URL
        homoglyph_result = has_homoglyph(embedded_url)
        if homoglyph_result:
            return homoglyph_result
        
        typosquatting_result = is_typosquatted(embedded_url)
        if typosquatting_result:
            return typosquatting_result
        
        subdomain_spoofing_result = is_subdomain_spoofed(embedded_url)
        if subdomain_spoofing_result:
            return subdomain_spoofing_result

        return f"⚠️ Unsure: {embedded_url} (Not in trusted domains)"
    

def is_shortened_url(url):
    """Check if a URL belongs to a known shortening service."""
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}" in domains.shortened_domains

def expand_shortened_url(short_url):
    if not is_shortened_url(short_url):
        return short_url
    
    try:
        headers = {"User-Agent": "Mozilla/5.0"} #
        response = requests.head(short_url, headers=headers, allow_redirects=True, timeout=2 )
        return response.url #return expanded url
    except requests.exceptions.RequestException:
        return short_url # returns original url if fails
    

def check_typosquat(domain, threshold=2):
    possible_typosquat_similarity_map = dict()

    for trusted in domains.trusted_domains:
        dist = distance(domain, trusted)
        if dist <= threshold:  # Small distance means similar typo
            possible_typosquat_similarity_map[trusted] = dist
    
    return possible_typosquat_similarity_map
    
# check for subdomain spoofing
def check_subdomain_spoofed(subdomain):
    possible_spoofed_subdomains = []

    for trusted in domains.trusted_domains:
        trusted_base = trusted.split('.')[0]
        if trusted_base in subdomain.split('.'):
            possible_spoofed_subdomains.append(trusted_base)

    return possible_spoofed_subdomains


def check_homoglyph(url):

    if bool(confusable_homoglyphs.confusables.is_dangerous(url)):
        characters =[]

        confusable = confusable_homoglyphs.confusables.is_confusable(url, greedy=True, preferred_aliases=['latin'])
        
        for item in confusable:
            characters.append(item['character'])

        return f"⚠️ homoglyph detected: {characters} in {url}"
    
# //simplier algo (escapes once 1 homoglyph character is detected)
# //less processing, might be more feasible if finding out all homoglyph char isn't neccessary

    # if bool(confusable_homoglyphs.confusables.is_dangerous(url)):

    #     character = confusable_homoglyphs.confusables.is_confusable(url, preferred_aliases=['latin'])[0]['character']
        
    #     return f"⚠️ homoglyph detected: {character} in {url}"