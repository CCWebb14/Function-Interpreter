FROM node:22.2.0

WORKDIR /app 

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run

EXPOSE 4001

CMD ["npm", "run", "dev"]