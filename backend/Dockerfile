FROM node:12

WORKDIR /usr/src/app

COPY package.json .

RUN npm config set proxy http://172.30.35.145:8080/
RUN npm install --loglevel verbose

COPY . .

EXPOSE 4000

CMD ["npm","start"]
