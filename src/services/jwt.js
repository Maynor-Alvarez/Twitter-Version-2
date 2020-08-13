'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'p4ssUs3r0101';

exports.createToken = (user)=>{
    let payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        iat: moment().unix(),
        exp: moment().add(2, "days").unix()
    };
    return jwt.encode(payload, key);
}

