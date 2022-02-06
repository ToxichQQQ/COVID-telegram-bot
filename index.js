const telegramAPI = require('node-telegram-bot-api')
const covidInfo = require('covid19-api')
const country = require('./country')
const  token = 'Your Bot Token'

const bot = new telegramAPI(token,{polling:true})



bot.on('message', async (msg) => {
    const text = msg.text
    const chatID = msg.chat.id

    if (text === '/start'){
        bot.sendMessage(chatID, `Hi! This telegram bot sends statistics on those infected with COVID-19. 
To get statistics, just send the name of the country
For a list of all countries send /help `)
        return false
    }
    if (text === '/help'){
        bot.sendMessage(chatID, `${country}`)
        return false
    }

    try {
        const covidData  =  await covidInfo.getReportsByCountries(text)

        const countData = covidData[0][0]
        const activeCase = countData.active_cases[0]
        const formatData =`
            ${countData.country}:
Infection cases: ${(countData.cases).toLocaleString('ru')},
Deaths: ${(countData.deaths).toLocaleString('ru')},
Recovered: ${(countData.recovered).toLocaleString('ru')},
            
Current patients: ${(activeCase.currently_infected_patients).toLocaleString('ru')},
Average condition: ${(activeCase.inMidCondition).toLocaleString('ru')},
Critical States: ${(activeCase.criticalStates).toLocaleString("ru")}
            
    `
        await  bot.sendMessage(chatID, `${formatData}`)
    }catch (e) {
        bot.sendMessage(chatID, `This country is not in the list of countries`)
    }
})