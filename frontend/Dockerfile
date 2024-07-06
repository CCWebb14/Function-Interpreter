FROM node:22.2.0

WORKDIR /app 

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_PORT=4000

# TODO: For prod build
#  RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "dev"]