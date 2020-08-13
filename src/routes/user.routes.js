'use strict'

const express = require('express');
const twitterController = require('../controllers/twitter.controller');
const api = express();
const authController = require('../middlewares/auth');

api.post('', authController.ensureAuth, twitterController.commands);

module.exports = api;