const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    res.json('get usuario')
})

//para crear data (buena practica)
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    /*
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }*/
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