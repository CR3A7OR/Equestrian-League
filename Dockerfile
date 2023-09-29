FROM node:latest

# Create the bot's dirertory

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install
# Start the bot.

CMD ["node", "index.js"]
