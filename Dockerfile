FROM node:latest

# Create the bot's dirertory

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install
# Start the bot.

<<<<<<< HEAD
CMD ["node", "deploy-commands.js"]
=======
>>>>>>> 00ed65a7fe94b4c40cffe90da83b29b0d0341439
CMD ["node", "index.js"]
