const program = require('commander')
const TelegramBot = require('node-telegram-bot-api')

const token = '<your token>'
const chatId = '<your chatid>'

const bot = new TelegramBot(token, { polling: true })

//first coomand to send your message  
program
    .command('send-message <message>')
    .description('Send a message to the Telegram bot.')
    .action((message) => {
        bot.sendMessage(chatId, message)
    })

//second coomand to send your photo      
program
    .command('send-photo <pathToPhoto>')
    .description('Send a photo to the Telegram bot.')
    .action((pathToPhoto) => {
        bot.sendPhoto(chatId, pathToPhoto)
    })

    program.parse(process.argv)
