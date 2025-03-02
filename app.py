# Ollama
from ollama import chat
from pydantic import BaseModel

# Flask
from flask import Flask, request
from flask import jsonify


class Output(BaseModel):
    URL: str
    is_phishing_link: bool
    description: str


app = Flask(__name__)


@app.route("/")
def welcome():
    return "hello"


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

    print(result)

    return result


if __name__ == "__main__":
    # run app in debug mode on port 5000
    app.run(debug=True)
