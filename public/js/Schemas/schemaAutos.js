var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schemas = {
    resWatsonSchema: new Schema({
        id:{type:String},
        fecha:{type:String},
        intents: {type: Object},
        entities: {type: Object},
        input: {type: Object},
        output: {type: Object},
        context: {type: Object},
    })
};

module.exports = schemas;