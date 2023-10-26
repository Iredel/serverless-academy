const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const token = '<your token>'
const weatherApiToken = '<your api key>'

const bot = new TelegramBot(token, {polling: true})

//create request to weather api and return weather data
const getWeatherForecast = async () =>{
    let weatherData
    await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=49.588264708913414&lon=34.55444747047335&appid=${weatherApiToken}&units=metric`)
        .then((response) =>{
            weatherData = response.data
        })
            
    return weatherData
}

//command to start bot
bot.onText(/\/start/, (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Weather forecast in Poltava'],
            ],
        resize_keyboard: true
      })
    }
    bot.sendMessage(msg.chat.id, "YES", opts)
})

//bot check message and sends weather data depending on the interval.
bot.on('message', (msg) =>{
    let interval3Hours
    let interval6Hours
    switch (msg.text) {
        case 'Weather forecast in Poltava':
          bot.sendMessage(msg.chat.id, 'Choose interval', {
            reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
              keyboard: [
                ['3 hours interval'],
                ['6 hours interval']
              ],
              resize_keyboard: true
            })
          })
          break
        case '3 hours interval':
            clearInterval(interval6Hours)
            interval3Hours = setInterval(async () =>{
                let weatherForecast = await getWeatherForecast()
                bot.sendMessage(msg.chat.id, `It is ${weatherForecast.weather[0].main} in Poltava at the moment, the temperature is ${weatherForecast.main.temp}°c and the wind speed is ${weatherForecast.wind.speed} km/h` )
            },  3 * 60 * 60 * 1000)
          break
        case '6 hours interval':
            clearInterval(interval3Hours)
            interval6Hours = setInterval(async () =>{
                let weatherForecast = await getWeatherForecast()
                bot.sendMessage(msg.chat.id, `It is ${weatherForecast.weather[0].main} in Poltava at the moment, the temperature is ${weatherForecast.main.temp}°c and the wind speed is ${weatherForecast.wind.speed} km/h` )
            },  6 * 60 * 60 * 1000)
          break
      }
})