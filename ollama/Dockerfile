# Reference: https://stackoverflow.com/questions/78500319/how-to-pull-model-automatically-with-container-creation

FROM ollama/ollama

# Copy the script to the docker image
COPY ./wait_for_ollama.sh /wait_for_ollama.sh

# Ensure the script is executable
RUN chmod +x /wait_for_ollama.sh

EXPOSE 11434
ENTRYPOINT ["/bin/sh", "/wait_for_ollama.sh"]