'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    tweets: [{type: Schema.Types.ObjectId, ref: 'tweet'}],
    noTweets: Number,
    followers: [{type: String}],
    noFollowers: Number
});

module.exports = mongoose.model('user', userSchema);