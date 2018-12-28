const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true, //uniqueValidator
        required: [true, 'El nombre es necesario para la categoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);