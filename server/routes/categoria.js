const express = require('express');
const app = express();
const { verificaToken, verificaAdmin_role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');


// =============================
//  Mostrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 0);

    Categoria.find({})
        .skip(desde)
        .limit(limite)
        //ordena por la descripcion
        .sort('descripcion')
        //populate, revisara que objectId hay en la peticion(categoria) y nos permite mostrar informacion
        .populate('usuario', 'nombre email')
        //en caso de tener otro objectId
        //.populate('otro', 'campo campo')
        .exec((err, listadoCategoriasBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    conteo, //cantidad de registros en base
                    length: listadoCategoriasBD.length, //cantidad segun criterios de busqueda
                    categorias: listadoCategoriasBD
                })
            });
        });
});


// =============================
//  Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById();
    let id = req.params.id; //parametro por url
    Categoria.findById(id, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //no existe el id
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});


// =============================
//  Crear nueva categoria
// =============================
app.post('/categoria', verificaToken, (req, res) => {

    //req.usuario._id, de quien crea la categoria
    //si no se realiza el middleware verificaToken, no tendria el usuario en el req
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //save retorna un err o una categoria de base de datos
    categoria.save((err, categoriaNuevaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //no se creo
        if (!categoriaNuevaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creo la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria_creada: categoriaNuevaDB
        })
    })
});


// =============================
//  Actualizar
// =============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //actualizar el nombre de la categoria

    let id = req.params.id; //parametro por url
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findOneAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaActualizada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //no existe el id
        if (!categoriaActualizada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria_actualizada: categoriaActualizada
        })

    });

});


// =============================
//  Eliminar
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {
    //solo un admin puede borrar las categorias
    //eliminar fisicamente, no desactivar

    let id = req.params.id; //parametro por url

    Categoria.findOneAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) { //no existe
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria_eliminada: categoriaBorrada
        });
    });
});




module.exports = app;