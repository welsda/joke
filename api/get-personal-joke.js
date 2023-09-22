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

    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
                
        const jokes = await Joke.find({ list: 'pessoal' });

        if (jokes.length === 0) {
            return res.status(200).json({
                fulfillmentMessages: [
                    {
                      text: {
                        text: [
                            'Vc não tem piadas na sua lista'
                        ]
                      }
                    }
                ]
            });
        } else {
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)].text;

            return res.status(200).json({
                fulfillmentMessages: [
                    {
                      text: {
                        text: [
                            randomJoke
                        ]
                      }
                    }
                ]
            });
        }
    } catch (error) {
        return res.status(500).json({
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                        'Não deu pra pegar uma piada da sua lista'
                    ]
                  }
                }
            ]
        });
    } finally {
        await mongoose.disconnect();
    }
};
