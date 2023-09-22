// const mongoose = require('mongoose');

// const Joke = mongoose.model('Joke', {
//     list: String,
//     text: String
// });

module.exports = async (req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // const intentName = req.body.queryResult.intent.displayName;
    // const userText = req.body.queryResult.queryText;

    // let list;
    // let message;

    try {
        // await mongoose.connect(process.env.MONGO_DB_URI);

        // if (intentName === "piada.adicionar") {
        //     await Joke.create({ 
        //         list: "pessoal",
        //         text: userText 
        //     });

        //     message = 'Adicionei mais uma piada na sua lista, depois eu conto ela pra vc hehe';
        // } else {
        //     userText.toLowerCase().includes('pessoal') 
        //     ? list = 'pessoal' 
        //     : 'geral';

        //     const jokes = await Joke.find({ list: list });

        //     if (list === 'pessoal') {
        //         jokes.length === 0 
        //         ? message = 'Vc não tem piadas na sua lista' 
        //         : jokes[Math.floor(Math.random() * jokes.length)].text;
        //     } else {
        //         jokes.length === 0 
        //         ? message = 'Não consegui pensar em uma piada pra vc' 
        //         : jokes[Math.floor(Math.random() * jokes.length)].text;
        //     }

        //     message = list;
        // }

        return res.status(200).json({
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                        'opa'
                    ]
                  }
                }
            ]
        });
    } catch (error) {
        // if (intentName === "piada.adicionar" ) {
        //     message = 'Não deu pra adicionar sua piada na lista';
        // } else {
        //     userText.toLowerCase().includes('pessoal') 
        //     ? message = 'Não deu pra pegar uma piada da sua lista' 
        //     : message = 'Deu um erro aqui, espera um pouquinho?';
        // }

        return res.status(500).json({
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                        'ixi'
                    ]
                  }
                }
            ]
        });
    }
    // } finally {
    //     await mongoose.disconnect();
    // }
};