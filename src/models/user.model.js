'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    noTweets: Number,
    noFollowers: Number,
    tweets: [{type: Schema.Types.ObjectId, ref: 'tweet'}],
    followers: [{type: String}],
});

module.exports = mongoose.model('user', userSchema);