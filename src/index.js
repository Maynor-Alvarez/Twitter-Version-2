'use strict'

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT;
const mongoURL = process.env.MONGO_URL;


mongoose.connect(mongoURL, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false})
.then(()=>{
    console.log('Conexion a la base de datos completa');
    app.listen(port, ()=>{
        console.log('express corriendo');
    });
})
.catch((err)=>{
    console.log('Error al conectarse, error:', err);
})