const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// ====================
//  Obtener productos
// ====================
app.get('/producto', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = Number(req.query.desde || 0);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, listadoProductosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo, //cantidad de registros en base
                    length: listadoProductosBD.length, //cantidad segun criterios de busqueda
                    productos: listadoProductosBD
                })
            });
        });
});


// ==========================
//  Obtener un producto po ID
// ==========================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //no existe el id
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBD
            });
        });
});


// ==========================
//  Crear un producto
// ==========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //RegExp, es como un like, la i le indica que no sea sensible a mayus o minuscula
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            });
        });
});



// ==========================
//  Crear un producto
// ==========================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoGrabadoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //201, es el estado al crear un nuevo registro
        res.status(201).json({
            ok: true,
            producto: productoGrabadoBD
        })
    });
});


// ==========================
//  Actualizar un producto
// ==========================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        productoBD.save((err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto_actualizado: productoActualizado
            });
        });
    });
});


// ==========================
//  Borrar un producto
// ==========================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //cambiar el estado del
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) { //no existe
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto_borrado: productoBorrado
        })
    })
});



module.exports = app;