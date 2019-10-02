
var mongoose = require('mongoose');
var socialMediaSchema = require('../Schemas/SchemaSocialMedia').socialMediaSchema;

var models = {
    socialMedia: mongoose.model('telefonica', socialMediaSchema)
};
module.exports = models;