//process, obj global que existe mientras corre la app de node y cambia dependiendo de el entorno donde este la app

//si no existe process.env.PORT, el puerto sera el 3000(cuando corra local)
process.env.PORT = process.env.PORT || 3000;