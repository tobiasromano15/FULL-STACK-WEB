const db = require('../Model/schema')

module.exports.getGrupos = async function getGrupos(req,res){
    res.send(await db.getGrupos());
}

module.exports.getEquipos = async function getEquipos(req,res){
    res.send(await db.findEquipos())
}

module.exports.getGrupo = async function getGrupo(req,res){
    if(req.params.grupo){
        console.log("grupo : " + req.params.grupo)
        res.send(await db.getGrupo(req.params.grupo))}
    else
        res.send("no existe tal grupo").status(400)
}


module.exports.getEquipo = async function getEquipo(req,res){
    if(req.params.equipo){
        console.log("Equipo : " + req.params.equipo)
        res.send(await db.getEquipo(req.params.equipo))}
    else
        res.send("no existe tal grupo").status(400)
}