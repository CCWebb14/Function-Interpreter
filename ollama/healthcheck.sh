#!/bin/bash

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:11434/api/show \
    -H "Content-Type: application/json" \
    -d '{
        "name": "llama3"
    }')

if [ "$response" -eq 200 ]; then
    echo "Health check passed!"
    exit 0
else
    echo "Health check failed with response code $response"
    exit 1
fi