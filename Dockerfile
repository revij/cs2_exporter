FROM node:20.11.1-alpine

WORKDIR /cs2_exporter

COPY . .
RUN npm install pm2 -g
RUN npm install

CMD ["pm2-runtime", "index.js"]