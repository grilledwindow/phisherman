#!/usr/bin/env bash
ollama serve &
sleep 5

cd /root/backend && flask run --host=0.0.0.0 -p 3000