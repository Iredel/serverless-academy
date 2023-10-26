const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const NodeCache = require( "node-cache" );

const token = '<your token key>'
const weatherApiToken = '<your api key>'
const userMenuState = {
    menuState:'initialMenu'
}
const bot = new TelegramBot(token, {polling: true}) //init telegram bot 
const myCache = new NodeCache() //init cache

//create request to weather api and return weather data
const getWeatherForecast = async () =>{
    let weatherData
    await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=49.588264708913414&lon=34.55444747047335&appid=${weatherApiToken}&units=metric`)
        .then((response) =>{
            weatherData = response.data
        })
            
        if(!weatherData){
            return 'error'
        }else {
            return currencyData
        }
}

//create request to privatBank and return currency data
const getCurrency = async () =>{
    let currencyData
    await axios.get(
        `https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5`)
        .then((response) =>{
            currencyData = response.data
        })
            
    if(!currencyData){
        return 'error'
    }else {
        return currencyData
    }
}

//func for call menu depending on manuState
const callMenu = (menuState, msg) =>{
    switch(menuState){
        case 'initialMenu':
            return {
                reply_to_message_id: msg.message_id,
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Weather forecast in Poltava'],
                        ['konvertor']
                    ],
                resize_keyboard: true
                })
            }
        case 'weatherMenu':
            return {
                reply_to_message_id: msg.message_id,
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['3 hours interval'],
                        ['6 hours interval'],
                        ['Previous menu']
                    ],
                    resize_keyboard: true
                })
            }
        case 'currencyMenu':
            return {
                reply_to_message_id: msg.message_id,
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['USD'],
                        ['EUR'],
                        ['Previous menu']
                    ],
                    resize_keyboard: true
                })
              }

    }
}

//func set the interval for sending weather forecast messeges
const setDepartureMsgInterval = (interval, msg) =>{
    let interval3Hours
    let interval6Hours
    switch(interval){
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
}

//func sending a currecy meseges
const sendCurrency = async (currency, msg) => {
    const currentTime = Date.now()
    let lastDataFetchTime = 0
    //artificial pause of 60 seconds
    if(currentTime - lastDataFetchTime >= 60000){
        const currencyData = await getCurrency()

        const usd = currencyData.find(item => item.ccy === "USD")
        const eur = currencyData.find(item => item.ccy === "EUR")

        myCache.mset([
            {key: "usd", val: usd},
            {key: "eur", val: eur},
        ])

        lastDataFetchTime = currentTime
    }

    switch (currency) {
        case 'USD':
            const usdData = myCache.get("usd");
            if(usdData){
                bot.sendMessage(msg.chat.id, `USD \n buy: ${usdData.buy} UAH \n sale: ${usdData.sale} UAH`)
            }
            break

        case 'EUR':
            const eurData = myCache.get("eur")
            if(eurData){
                bot.sendMessage(msg.chat.id, `EUR \n buy: ${eurData.buy} UAH \n sale: ${eurData.sale} UAH`)
            }        
            break
    }
}

//command to start bot
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "YES", callMenu(userMenuState.menuState, msg))
})


bot.on('message', (msg) =>{
    switch (msg.text) {
        case 'Weather forecast in Poltava':
            userMenuState.menuState = 'weatherMenu'
            bot.sendMessage(msg.chat.id, 'Choose interval', callMenu(userMenuState.menuState, msg))
            break

        case 'konvertor':
            userMenuState.menuState = 'currencyMenu'
            bot.sendMessage(msg.chat.id, 'Choose currency', callMenu(userMenuState.menuState, msg))
            break

        case 'Previous menu':
            userMenuState.menuState = 'initialMenu'
            bot.sendMessage(msg.chat.id, 'YES', callMenu(userMenuState.menuState, msg))
            break

        case '3 hours interval':
            setDepartureMsgInterval(msg.text, msg)
            break

        case '6 hours interval':
            setDepartureMsgInterval(msg.text, msg)
            break
        
        case 'USD':
            sendCurrency(msg.text, msg)
            break
        
        case 'EUR':
            sendCurrency(msg.text, msg)
            break
    }
    
})
