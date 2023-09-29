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

    const { _id, name, joke, ssn } = req.body.queryResult.parameters;
    const _idWithoutWhiteSpaces = _id.replace(/\s/g, '');
    const intentName = req.body.queryResult.intent.displayName;
    const ssnWithoutWhiteSpaces = ssn.replace(/\s/g, '');

    let body;
    let statusCode;

    try {
        await mongoose.connect(process.env.MONGO_DB_URI);

        if (intentName === 'piada.adicionar') {
            const addedJoke = await Joke.create({ 
                joke: joke,
                list: 'pessoal',
                name: name,
                ssn: ssnWithoutWhiteSpaces
            });

            body = { fulfillmentText: `Adicionei mais uma piada na sua lista, ${addedJoke._id} é o código dela para caso você queira atualiza-la ou deleta-la depois.\nQuer que eu te conte uma piada agora?` };
        } else if (intentName === 'piada.geral') {
            const generalJokes = await Joke.find({ list: 'geral' });

            generalJokes.length === 0
            ? body = { fulfillmentText: "Hmm, parece que nosso banco de dados não têm piadas pra você :/, mas não se preocupe que logo menos estarão lá.\nAté a próxima haha" }
            : body = { fulfillmentText: `${generalJokes[Math.floor(Math.random() * generalJokes.length)].joke}\nAté a próxima haha` };
        } else if (intentName === 'piada.pessoal') {
            const personalJokes = await Joke.find({ ssn: ssnWithoutWhiteSpaces });

            if (personalJokes.length === 0) {
                body = {
                    fulfillmentMessages: [
                      {
                        card: {
                          title: "Sem piadas na sua lista",
                          subtitle: "Adicione uma pelo menu principal e depois volte aqui",
                          imageUri: "https://indianmemetemplates.com/wp-content/uploads/okay-guy.jpg",
                          buttons: [
                            {
                              text: "Até lá, veja outras piadas aqui haha",
                              postback: "https://www.piadas.com.br/"
                            }
                          ]
                        }
                      }
                    ]
                }
            } else {
                const personalJoke = personalJokes[Math.floor(Math.random() * personalJokes.length)];

                body = { fulfillmentText: `Contemple uma de suas pérolas ${personalJoke.name}:\n${personalJoke.joke}\nAté a próxima haha` };
            }
        } else if (intentName === 'piada.confirmar.atualizar' || intentName === 'piada.confirmar.deletar') {
            const requestedJoke = await Joke.findById(_idWithoutWhiteSpaces);

            if (requestedJoke === null) {
                body = { fulfillmentText: "Não encontrei nenhuma piada com o código informado.\nAté a próxima haha" };
            } else {
                if (requestedJoke.ssn === ssnWithoutWhiteSpaces) {
                    intentName === 'piada.confirmar.atualizar'
                    ? body = { fulfillmentText: `Tem certeza que deseja atualizar a seguinte piada? "${requestedJoke.joke}"` }
                    : body = { fulfillmentText: `Tem certeza que deseja deletar a seguinte piada? "${requestedJoke.joke}"` };
                } else {
                    body = { fulfillmentText: "Não encontrei nenhuma piada com o código informado atrelado ao cpf mencionado.\nAté a próxima haha" };
                }
            }
        } else if (intentName === 'piada.atualizar' || intentName === 'piada.deletar') {
            const { _id } = req.body.queryResult.outputContexts[0].parameters;

            if (intentName === 'piada.deletar') {
                const deletedJoke = await Joke.findByIdAndDelete(_id);

                body = { fulfillmentText: deletedJoke };
            }
        }

        statusCode = 200;
    } catch (error) {
        if (intentName === 'piada.adicionar' ) {
            body = { fulfillmentText: 'Não deu pra adicionar sua piada na lista por conta de algo estranho :/, quem sabe depois.\nAté a próxima haha' };
        } else if (intentName === 'piada.geral') {
            body = { fulfillmentText: 'Não deu pra pegar uma piada do nosso banco de dados pra você por conta de algo estranho :/, quem sabe depois.\nAté a próxima haha' };
        } else if (intentName === 'piada.pessoal') {
            body = { fulfillmentText: 'Não deu pra pegar uma piada da sua lista por conta de algo estranho :/, quem sabe depois.\nAté a próxima haha' };
        }

        statusCode = 400;
    } finally {
        await mongoose.disconnect();

        return res.status(statusCode).json(body);
    }
};