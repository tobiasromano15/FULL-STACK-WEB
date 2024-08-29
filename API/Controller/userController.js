const db = require('../Model/schema')
const bcrypt = require('bcrypt')

module.exports.getUsuarios = async function getUsuarios(req,res){
    res.send(await db.findUsers());
}

module.exports.getUsuario = async function getUsuario(req,res){
    /*por mas que llamemos usuario al argumento que se usa para pedir por un usuario especifico, en realidad se hace matching con el
    nombre del usuario, no con el usuario en si, que es un atributo privado de cada documento*/

    rta = await db.findUser(req.params.user) 
    if (rta.length != 0){
        res.send(rta);}
    else{
        res.status(400).send("El usuario solicitado no existe")}
}


/*Esta funcion retorna el cuadro del que es hincha la persona guardado en el primer documento que concida con el nombre pasada en el req.params
por ende, si existen 3 Matias, solo retornara el cuadro del primero que encuentre*/

module.exports.getCuadro = async function (req,res){

    rta = await db.findUserCuadro(req.params.user) 
    if (rta.length != 0){
        res.send(rta);}
    else{
        res.status(400).send("El usuario solicitado no existe")}
}

module.exports.postUsuario = async function postUsuario(req,res){
    if ('nombre' in req.body && 'usuario' in  req.body && 'password' in req.body){
        var hashedPassword = await bcrypt.hash(req.body.password, 10);
        let  rta = await db.postUsuario(req.body,hashedPassword)
        if(rta == 201){
            res.status(201).send("El usuario se ha creado correctamente")
        }
        else
            res.status(409).send("El nombre de Usuario ingresado ya se encuentra Registrado, elije otro")
    }
    else
        res.status(304).send("no hay body en el post")
}

module.exports.patchUsuario = async function patchUsuario(req,res){
    if ('usuario' in req.body){
        if ('password' in req.body){
            var hashedPassword = await bcrypt.hash(req.body.password, 10)
            req.body.password = hashedPassword;
        }
        let rta = await db.patchUsuario(req.body)
        if (rta == 400)
            res.status(400).send("El nuevo usuario ingresado ya existe, por favor elije otro")
        else res.sendStatus(200)
    }
}

module.exports.deleteUsuario = async function (req,res){
    if ('usuario' in  req.body){
        let rta = await db.deleteUsuario(req.body)
        if(rta == '201')
            res.status(201).send("El usuario se ha eliminado")
        else
            if (rta == '404')
                // no se le puede setear mensaje al 304!!
                res.status(404).send("No se pudo encontrar el usuario")
                
            
            else
                res.status(401).send("No puedes eliminar este usuario")
            
    }
    else
        res.status(400).send("no hay body en el delete, no hay usuario que eliminar")
    
}
