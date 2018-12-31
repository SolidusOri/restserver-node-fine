const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// ====================
//  Obtener productos
// ====================
app.get('/productos', (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
});


// ==========================
//  Obtener un producto po ID
// ==========================
app.get('/productos/:id', (req, res) => {
    //populate: usuario categoria
});


// ==========================
//  Crear un producto
// ==========================
app.post('/productos', (req, res) => {
    //grabar el usuario
    //grabar una categora del listado
});


// ==========================
//  Actualizar un producto
// ==========================
app.put('/productos/:id', (req, res) => {

});


// ==========================
//  Borrar un producto
// ==========================
app.delete('/productos/:id', (req, res) => {
    //cambiar el estado del campo disponible
});



module.exports = app;