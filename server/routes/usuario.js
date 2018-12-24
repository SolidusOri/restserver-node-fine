const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
//middlewares
const { verificaToken } = require('../middlewares/autenticacion');


//verificaToken es el middlewares que se dispara cuando se hace el get y se ponen como segundo argumento
app.get('/usuario', verificaToken, (req, res) => {

    //|| si no viene el parametro desde sera 0
    //req.query vienen los parametros opcionales
    let desde = Number(req.query.desde || 0);

    let limite = Number(req.query.limite || 5);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) //salta los registros, para paginar por ejemplo
        .limit(limite) //limite de registros en el resultado
        .exec((err, listaUsuariosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    length: listaUsuariosBD.length,
                    usuarios: listaUsuariosBD
                })
            });
        })

    //res.json('get usuario')
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

    //save retorna un err o un usuario de base de datos
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
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //el email no se podria modificar por el uniqueValidator en el schema usuario

    //findByIdAndUpdate utiliza mas recursos
    //{new:true} me devuelve el usuario modificado
    //runValidators: true, ejecuta las velidaciones del schema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
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

})

//ahora no se acostumbra a borrar en las bd, se le cambia el estado a un registro
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    /*
    //Borrado fisico de la BD
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) { //no existe
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    */

    //cambiaEstado es el campo del usuario que queremos modificar
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) { //no existe
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})


module.exports = app;