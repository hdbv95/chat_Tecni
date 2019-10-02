var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemas = {
    sugerenciaSchema: new Schema({
        chat: {type: String},
        sugerencias: {type: String},
    })
};

module.exports = schemas;