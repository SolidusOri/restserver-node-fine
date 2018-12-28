const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //genera el token
const Usuario = require('../models/usuario');

//google sing-in =====================================
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//====================================================


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
            usuario: usuarioBD //nuestro payload seria el usuario de BD
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }); //esto serian 30 dias, segundos * minutos * horas * dias

        //si llega a este punto es porque no se realizo ningun return
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });

});









//configuraciones de google
//---------------------------------------------
//verifica el token con libreria de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
//--------------------------------------------

app.post('/google', async(req, res) => {

    let token = req.body.idtoken; //token que viene del frontend

    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    /*si llega aqui no se realizo el catch y el googleUser tiene el resultado de la funcion verify,
    la cual valida el token que viene del frontend y regresa el un obj creado con el payload despues de verificar el token*/
    //busco en la base con por el campo email
    Usuario.findOne({ email: googleUser.email }, (err, usuarioEncontradoBD) => {

        //error en la BD
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //si en la base hay un documento(usuario) con ese email
        if (usuarioEncontradoBD) {
            //revisamos si ese usuario no se autentico por google sing-in
            if (usuarioEncontradoBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                //si existe el usuario con ese email y se autentico por google
                let token = jwt.sign({
                    usuario: usuarioEncontradoBD
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioEncontradoBD,
                    token
                });

            }
        } else {
            //esto significa que es primera vez que el usuario se esta autenticando y no existe en la BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true; //lo creamos como usuario de google
            usuario.password = ':)'; //campo obligatorio en el modulo

            usuario.save((err, nuevoUsuarioBD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: nuevoUsuarioBD
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: nuevoUsuarioBD,
                    token
                });

            });
        }

    });

});















module.exports = app;