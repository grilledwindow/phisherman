#!/usr/bin/env bash
ollama serve &
sleep 5
python3.12 -m flask run -h 0.0.0.0 -p 5000
