const express = require('express');
const app = express();

app.get('/usuario', function(req, res) {
    res.json('get usuario')
})

//para crear data (buena practica)
app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
})

//para actualizar data (buena practica)
app.put('/usuario/:id', function(req, res) { //:id ,es un parametro
    let id = req.params.id;
    res.json({
        id
    })
})

//ahora no se acostumbra a borrar en las bd, se le cambia el estado a un registro
app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
})


module.exports = app;