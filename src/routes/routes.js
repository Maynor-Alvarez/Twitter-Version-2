'use strict'

const express = require('express');
const Controller = require('../controllers/controller');
const api = express();
const authController = require('../middlewares/authenticated');

api.post('', authController.ensureAuth,Controller.command);

module.exports = api;