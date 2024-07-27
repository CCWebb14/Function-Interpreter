# Reference: https://stackoverflow.com/questions/78500319/how-to-pull-model-automatically-with-container-creation

FROM ollama/ollama

# Curl required for healthcheck
RUN apt-get install -y curl

# Copy the script to the docker image
COPY ./wait_for_ollama.sh /wait_for_ollama.sh
COPY healthcheck.sh /usr/local/bin/ 

# Ensure the script is executable
RUN chmod +x /wait_for_ollama.sh
RUN chmod +x /usr/local/bin/healthcheck.sh

EXPOSE 11434

ENTRYPOINT ["/bin/sh", "/wait_for_ollama.sh"]