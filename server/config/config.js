//process, obj global que existe mientras corre la app de node y cambia dependiendo de el entorno donde este la app

//si no existe process.env.PORT, el puerto sera el 3000(cuando corra local)
process.env.PORT = process.env.PORT || 3000;



//Entorno
//process.env.NODE_ENV es una variable de entonrno en heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'desarrollo';

//base de datos
let urlDB;
if (process.env.NODE_ENV === 'desarrollo') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //process.env.MONGO_URL, variable de entorno creada en heroku
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;