const mongoose = require('mongoose');

const Joke = mongoose.model('Joke', {
    list: String,
    text: String
});

module.exports = async (req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const intentName = req.body.queryResult.intent.displayName;
    const userText = req.body.queryResult.queryText;

    let list;
    let message;
    let statusCode;

    try {
        await mongoose.connect(process.env.MONGO_DB_URI);

        if (intentName === "piada.adicionar") {
            await Joke.create({ 
                list: "pessoal",
                text: userText 
            });

            message = 'Adicionei mais uma piada na sua lista, quer que eu te conte uma piada agora?';
        } else if (intentName === 'piada.contar') {
            userText.toLowerCase().includes('pessoal') 
            ? list = 'pessoal' 
            : list = 'geral';

            const jokes = await Joke.find({ list: list });

            if (list === 'pessoal') {
                jokes.length === 0 
                ? message = 'Vc não tem piadas na sua lista' 
                : message = jokes[Math.floor(Math.random() * jokes.length)].text;
            } else {
                jokes.length === 0 
                ? message = 'Não consegui pensar em uma piada pra vc' 
                : message = jokes[Math.floor(Math.random() * jokes.length)].text;
            }
        }

        statusCode = 200;
    } catch (error) {
        if (intentName === "piada.adicionar" ) {
            message = 'Não deu pra adicionar sua piada na lista';
        } else {
            userText.toLowerCase().includes('pessoal') 
            ? message = 'Não deu pra pegar uma piada da sua lista' 
            : message = 'Deu um erro aqui';
        }

        statusCode = 400;
    } finally {
        await mongoose.disconnect();

        return res.status(statusCode).json({
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                        message
                    ]
                  }
                }
            ]
        });
    }
};