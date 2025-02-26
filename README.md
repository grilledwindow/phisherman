# Docker Phishing Email Model

## Pre-requsities for Windows

In order to run the ML segment, you'll need to install:

1. Windows WSL2
    1. [Setup Guide](https://learn.microsoft.com/en-us/windows/wsl/install)
2. Docker Desktop with WSL2
    1. [Windows Guide]('https://docs.docker.com/desktop/setup/install/windows-install/')
3. Ollama Docker Pre-requsities
    1. [Guide for WSL2](https://hub.docker.com/r/ollama/ollama)

> **After doing this restart your computer**

## Running the Docker Container

In the project directory run:

```bash
docker build -t phiserman/ml_model:v1 .
docker run -d --name phiserman_ml_model --rm --gpus=all -p 5000:5000 --name phisherman-model phiserman/ml_model:v1
```

Port 5000, will expose an API. To run a model, send a `POST` request to the url `http://localhost:5000/query_url`

Request Post Body should include a json as shown below:

```JSON
{
    "URL": "https://xn--pypl-53dc.com/"
}
```

**Please include the Content-Type field in the header as: "application/json"**

And in turn the reply will be in a JSON format:

```JSON
{
    "URL": str,
    "is_phishing_link": bool,
    "description": str
}
```
