const jwt = require('jsonwebtoken');



//========================
// verificar token
//========================
// esta funcion verifica el token para las demas rutas
let verificaToken = (req, res, next) => {

    //req, es la peticion, aqui estan los headers
    //esto lee el headers por el nombre
    let token = req.get('token');


    //recuperamos la informacion del token(payload)
    //decoded, informacion decodificada
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        //decoded, este es el payload retornado por la funcion verify
        req.usuario = decoded.usuario; //con esto le damos acceso a las demas peticiones o rutas
        next(); //el next(), hace que el se siga ejecutando el get
    });

};


module.exports = {
    verificaToken
}