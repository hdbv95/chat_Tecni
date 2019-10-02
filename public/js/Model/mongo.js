
var mongoose = require('mongoose');
var sugerenciaSchema = require('../Schemas/schema').sugerenciaSchema;

var models = {
    sugerencias: mongoose.model('sugerencias', sugerenciaSchema)
};
module.exports = models;