'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = Schema({
    content: String,
    user: String,
    noComments: Number,
    noLikes: Number,
    noRetweets: Number,
    comments: [{reply: String,user: String}],
    likes: [{type: String}],
    retweet:[{type: Schema.Types.ObjectId, ref: 'tweet'}],
});


module.exports = mongoose.model('tweet', tweetSchema);