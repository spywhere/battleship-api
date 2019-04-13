FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm install --production
RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "app.yml", "--only", "app"]
