require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //es para parsear datos a un obj

//app.use se disparará en cada peticion
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));


//BD
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online');
});

let puerto = process.env.PORT;

app.listen(puerto, () => {
    console.log('Escuchando puerto', puerto);
})