const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //genera el token
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {

    let body = req.body;

    //en la coleccion usuario de mongo el email es unico
    //{ email: body.email }, esta es la condicion para la busqueda
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        //error en mongo
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //no se encontro el usuario con el email
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    //en produccion no se debe indicar que fallo
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //en este punto ya encontro el email y se compara el password
        //compareSync, hace el match y retorna una true o false
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //generacion del token
        let token = jwt.sign({
            usuario: usuarioBD //payload
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }); //esto serian 30 dias, segundos * minutos * horas * dias

        //si llega a este punto es porque no se realizo ningun return
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });

});






















module.exports = app;