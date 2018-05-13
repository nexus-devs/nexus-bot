FROM node:alpine

RUN git clone https://github.com/nexus-devs/nexus-bot /app/nexus-bot \
  && cd /app/nexus-bot \
  && npm install

CMD [ "node /app/nexus-bot" ]
