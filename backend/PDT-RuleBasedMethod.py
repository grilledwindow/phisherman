
import confusable_homoglyphs.confusables
from flask import Flask, Request, jsonify, render_template
import tldextract
import domains
from Levenshtein import distance
import confusable_homoglyphs
import requests
import urllib.parse

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('gmail.html')


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


# failed
# def expand_and_check_redirect(url):
#     # If the URL is shortened, expand it first
#     if is_shortened_url(url):
#         expanded_url = expand_shortened_url(url)
#     else:
#         expanded_url = url

#     try:
#         headers = {"User-Agent": "Mozilla/5.0"}
#         response = requests.head(expanded_url, headers=headers, allow_redirects=True, timeout=2)
        
#         final_url = response.url
#         # Check if the final URL is on the same domain as the original URL
#         # Follow the entire redirect history
#         if response.history:
#             # If the final destination domain is different from the original
#             for resp in response.history:
#                 if extract_main_domain(resp.url) != extract_main_domain(final_url):
#                     return final_url, f"⚠️ Redirect detected: {expanded_url} -> {final_url}"
#         elif extract_main_domain(expanded_url) == extract_main_domain(final_url):
#             return final_url, None  # No redirect, return the URL

#         # If no history but domain mismatch
#         if extract_main_domain(expanded_url) != extract_main_domain(final_url):
#             return final_url, f"⚠️ Redirect detected: {expanded_url} -> {final_url}"
#         else:
#             return final_url, None  # No redirection

#     except requests.exceptions.RequestException:
#         return expanded_url, "⚠️ Failed to expand or check redirection"  # Return original URL if it fails

# Test the function
# 

def extract_main_domain(url):
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}"


def is_typosquatted(url, threshold=2):
    extracted = tldextract.extract(url)
    domain = extract_main_domain(url)

    #check if in trusted domain list
    if domain in domains.trusted_domains:
        return f"✅ Safe: {url}"

    # Adjust threshold for trusted domains
    if any(trusted in domain for trusted in domains.trusted_domains):
        threshold = 3 

    #Check for typosquatting
    for trusted in domains.trusted_domains:
        if distance(domain, trusted) <= threshold:  # Small distance means similar typo
            return f"⚠️ Possible typosquatting detected: {url} (Did you mean {trusted}?)"
    
    
    

# check for subdomain spoofing
def is_subdomain_spoofed(url):
    extracted = tldextract.extract(url) 
    subdomain = extracted.subdomain

    for trusted in domains.trusted_domains:
        trusted_base = trusted.split('.')[0]

        if trusted_base in subdomain.split('.'):

            return f"⚠️ Possible subdomain spoofing detected: {url} (Contains trusted name '{trusted_base}' in subdomain)"      


def has_homoglyph(url):

    if bool(confusable_homoglyphs.confusables.is_dangerous(url)):
        characters =[]

        confusable = confusable_homoglyphs.confusables.is_confusable(url, greedy=True, preferred_aliases=['latin'])
        
        for item in confusable:
            characters.append(item['character'])

        return f"⚠️ homoglyph detected: {characters} in {url}"
    

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


# @app.route('/check-url', methods=["GET", "POST"])
def check_url(url):
    # data = request.json
    # url = data.get('url')

    # if not url:
    #     return jsonify({"Error": "URL is required"}), 400

    expanded_url = expand_shortened_url(url)

    embedded_check_result = check_embedded_url_in_query(expanded_url)
    if embedded_check_result:
        return embedded_check_result

    homoglyph_result = has_homoglyph(expanded_url)
    if homoglyph_result:
        return homoglyph_result
    
    typosquatting_result = is_typosquatted(expanded_url)
    if typosquatting_result:
        return typosquatting_result
    
    subdomain_spoofing_result = is_subdomain_spoofed(expanded_url)
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
    "https://google-secure.com",         #          
    "https://google.login.com",          # domain spoofing
    "https://login.paypal.com",          # Safe
    "https://paypal.scammer.com",        # domain spoofing
    "https://secure-paypal.com",         #
    "https://dbs.com",                   # True (Spoofing)
    "https://secure.paypal.com",
    "https://www.uobgroup.com/uobgroup/newsroom/index.page",
    "https://раyраl.com",
    "https://pаypal.com",
    "https://confusable-homοglyphs.readthedocs.io/en/latest/apidocumentation.html#confusable-homoglyphs-package",
    "https://shorturl.at/xXfIb",
    "https://www.posb.com.sg/redirect?url=https://www.googl3.com", 
    "https://shorturl.at/ZAaws",             #typosquat + shortened
    "https://tinyurl.com/fake-google",
    "https://example.com/login?redirect_url=https://phishing-site.com",
    "https://example.com/?action=redirect&next=https://fake-site.com"


]


for url in test_urls:
    print("-------")
    print(check_url(url))
    # print(check_url(url))
    




    