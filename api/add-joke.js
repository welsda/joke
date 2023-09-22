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

    const requi = JSON.parse(req);
    const body = requi.body;

    try {
        // await mongoose.connect(process.env.MONGO_DB_URI);
        // await Joke.create({ 
        //     list: "pessoal",
        //     text: text 
        // });

        return res.status(200).json({
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                        body
                    ]
                  }
                }
            ]
        });
    } catch (error) {
        return res.status(500).json({
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                        'Não deu pra adicionar sua piada na lista'
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
