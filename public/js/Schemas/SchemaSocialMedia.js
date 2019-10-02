var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemas = {
    socialMediaSchema: new Schema({
        url: {type: String},
        text: {type: String},
        sentimientos:{type:String},
        location:{type:String},
        userNamer:{type:String},
        created_at:{type:String},
        name:{type:String},
        retweet_count:{type:String},
        followers_count:{type:String},
        friends_count:{type:String},
        favorite_count:{type:String},
        emociones:{type:String}
    })
};

module.exports = schemas;