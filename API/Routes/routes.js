const {Router} = require("express")
const router = Router()
const dbController = require('../Controller/dbController')
const userController = require('../Controller/userController')


router.get("/grupos", dbController.getGrupos)

router.get("/equipos", dbController.getEquipos)

router.get("/grupos/:grupo", dbController.getGrupo)

router.get("/equipos/:equipo", dbController.getEquipo)

router.get("/users/:user", userController.getUsuario)

router.get("/users", userController.getUsuarios)

router.get("/users/:user/cuadro", userController.getCuadro)

router.post("/users/", userController.postUsuario)

router.patch("/users/", userController.patchUsuario)

router.delete("/users/", userController.deleteUsuario)

module.exports = router