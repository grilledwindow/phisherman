from flask import Flask, request, jsonify, render_template
import tldextract
from trusted_domains import trusted_domains
from Levenshtein import distance

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
    
    extracted = tldextract.extract(url)
    typosquat_results = check_typosquat(f"{extracted.domain}.{extracted.suffix}")
    spoof_results = check_subdomain_spoofed(extracted.subdomain)

    return {"typosquat": typosquat_results, "spoof": spoof_results}, 200


def check_typosquat(domain, threshold=2):
    possible_typosquat_similarity_map = dict()

    for trusted in trusted_domains:
        dist = distance(domain, trusted)
        if dist <= threshold:  # Small distance means similar typo
            possible_typosquat_similarity_map[trusted] = dist
    
    return possible_typosquat_similarity_map
    
# check for subdomain spoofing
def check_subdomain_spoofed(subdomain):
    possible_spoofed_subdomains = []

    for trusted in trusted_domains:
        trusted_base = trusted.split('.')[0]
        if trusted_base in subdomain.split('.'):
            possible_spoofed_subdomains.append(trusted_base)

    return possible_spoofed_subdomains

