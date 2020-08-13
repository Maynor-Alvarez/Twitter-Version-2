'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'userPass';

exports.ensureAuth = (req, res, next) => {
    let params = req.body;
    let userData = Object.values(params);
    let resp = userData.toString().split(" ");

    if (!req.headers.authorization) {
        if (resp[0] === 'register') {
            next();
        } else if (resp[0] === 'login') {
            next();
        } else {
            return res.status(500).send({ message: 'logueate para tener acceso ' + resp[0] });
        }
    } else {
        const token = req.headers.authorization.replace(/["']+/g, '');
        try {
            var payLoad = jwt.decode(token, key, true);
            let idUser = payLoad.sub;
            let username = payLoad.username;
            module.exports.idUser = idUser;
            module.exports.username = username;
            if (payLoad.exp <= moment().unix()) {
                return res.status(401).send({ message: 'Token expirado.' });
            }
        } catch (ex) {
            return res.status(404).send({ message: 'Token no válido.' });
        }
        req.user = payLoad;
        next();
    }
}
