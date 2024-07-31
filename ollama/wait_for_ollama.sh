#!/bin/bash

# Reference: https://stackoverflow.com/questions/78500319/how-to-pull-model-automatically-with-container-creation

# Start Ollama in the background.
/bin/ollama serve &
# Record Process ID.
pid=$!

# Pause for Ollama to start.
sleep 5

echo "🔴 Retrieving LLAMA3 model..."
ollama pull llama3
echo "🟡 Loading LLAMA3 model..."
ollama run llama3
echo "🟢 Done! LLAMA3 model pulled and loaded"

# Wait for Ollama process to finish.
wait $pid