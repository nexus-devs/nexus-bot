FROM node:alpine

# Get git
RUN apk --update add git openssh

# Get repo
RUN git clone https://github.com/nexus-devs/nexus-bot /app/nexus-bot \
  && cd /app/nexus-bot \
  && npm install

# Run this thing
CMD [ "node", "/app/nexus-bot" ]
