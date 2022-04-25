![image](https://user-images.githubusercontent.com/64283902/118817039-6c9f0000-b8d0-11eb-9a31-872542d0d51e.png)
# KR-Genie

KR Genie is an economy bot inspired by Krunker.io. This project is maintained by https://bunkerbots.tech/

## Bot Devs
► [EJ BEAN#3961](https://github.com/EJBEAN2op)
► [JJ_G4M3R#2155](https://github.com/JJ-G4M3R)
► [Jytesh#3241](https://github.com/Jytesh)

# Self hosting
- The bot wasn't meant for self hosting by other users, no support will be provided for self hosting in Issue or in the Support Server, no further documentation will also be provided.

## Requirements
- [Node.js v16.11.0+](https://github.com/nvm-sh/nvm)
- MongoDB Server

* MongoDB can be installed directly in your computer and run locally or you can use [Atlas](https://codeforgeek.com/mongodb-atlas-node-js/) to deploy a cluster.
* Get the mongo url ( of the form mongodb+server://user:password@host or monogdb://user:password@host )

Make a file called .env and paste this and fill out your information
```
TOKEN=DISCORD_BOT_TOKEN
MONGO_URL=YOUR_MONGO_URL
```
Run `yarn start` in a terminal to get the bot up and running.


TODO

* convert to ts
* convert to slash commands
* add command wrappers
