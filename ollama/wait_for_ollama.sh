#!/bin/bash

# Reference: https://stackoverflow.com/questions/78500319/how-to-pull-model-automatically-with-container-creation

# Start Ollama in the background.
/bin/ollama serve &
# Record Process ID.
pid=$!

# Pause for Ollama to start.
sleep 5

echo "🔴 Retrieve LLAMA3 model..."
ollama pull llama3
echo "🟢 Done!"

# Wait for Ollama process to finish.
wait $pid
