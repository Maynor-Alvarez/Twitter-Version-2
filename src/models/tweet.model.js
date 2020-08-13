'use strict'

const mongoose = require('mongoose');
const { schema } = require('./user.model');
const Schema = mongoose.Schema;

const tweetSchema = Schema({
    content: String,
    user:String,
    numberComments: Number,
    comments: [{reply: String,
                user: String}],
    numberLikes: Number,
    likes: [{type: String}],
    numberRetweets: Number,
    retweet:[{type: Schema.Types.ObjectId, ref: 'tweet'}]
});


module.exports = mongoose.model('tweet', tweetSchema);