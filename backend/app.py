from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/gmail")
def gmail():
    return render_template("gmail.html")

