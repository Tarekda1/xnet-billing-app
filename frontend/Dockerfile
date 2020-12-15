#stage 1 create app directory
FROM node:latest as build
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/

RUN npm config set proxy http://172.30.35.145:8080/
RUN npm install --loglevel verbose

#ADD src /usr/src/front/app/src
#ADD public /usr/src/front/app/public

COPY . /app

#EXPOSE 8080

RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.17.8-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
