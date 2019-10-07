
var mongoose = require('mongoose');
var schemaAutos = require('../Schemas/schemaAutos').resWatsonSchema;

var models = {
    schemaAutos: mongoose.model('datosAuto', schemaAutos)
};
module.exports = models;