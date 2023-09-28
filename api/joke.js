const mongoose = require('mongoose');

const Joke = mongoose.model('Joke', {
    joke: String,
    list: String,
    name: String,
    ssn: String
});

module.exports = async (req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const intentName = req.body.queryResult.intent.displayName;
    const { name, joke, ssn } = req.body.queryResult.parameters;
   
    let message;
    let statusCode;

    try {
        await mongoose.connect(process.env.MONGO_DB_URI);

        if (intentName === 'piada.adicionar') {
            const addedJoke = await Joke.create({ 
                joke: joke,
                list: 'pessoal',
                name: name,
                ssn: ssn
            });

            message = `Adicionei mais uma piada na sua lista, ${addedJoke._id} é o código dela para caso você queira atualiza-la ou deleta-la depois.\nQuer que eu te conte uma piada agora?`;
        } else if (intentName === 'piada.geral') {
            const generalJokes = await Joke.find({ list: 'geral' });

            generalJokes.length === 0 
            ? message = 'Hmm, parece que nosso banco de dados não têm piadas pra você :/, mas não se preocupe que logo menos estarão lá.\nAté a próxima haha' 
            : message = `${generalJokes[Math.floor(Math.random() * generalJokes.length)].joke}\nAté a próxima haha`;
        } else if (intentName === 'piada.pessoal') {
            const personalJokes = await Joke.find({ ssn: ssn });

            if (personalJokes.length === 0) {
                message = 'Poxa, você não tem piadas na sua lista :/.\nAdicione uma no menu principal e depois volte aqui.\nAté a próxima haha';
            } else {
                const personalJoke = personalJokes[Math.floor(Math.random() * personalJokes.length)];

                message = `Contemple uma de suas pérolas ${personalJoke.name}:\n${personalJoke.joke}\nAté a próxima haha`;
            }
        }

        statusCode = 200;
    } catch (error) {
        if (intentName === 'piada.adicionar' ) {
            message = 'Não deu pra adicionar sua piada na lista por conta de algo estranho :/, quem sabe depois.\nAté a próxima haha';
        } else if (intentName === 'piada.geral') {
            message = 'Não deu pra pegar uma piada do nosso banco de dados pra você por conta de algo estranho :/, quem sabe depois.\nAté a próxima haha';
        } else if (intentName === 'piada.pessoal') {
            message = 'Não deu pra pegar uma piada da sua lista por conta de algo estranho :/, quem sabe depois.\nAté a próxima haha';
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