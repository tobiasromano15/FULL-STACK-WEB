const mongoose = require('mongoose');

const mongo = require("mongoose");
const dbName = 'CopaLibertadores';
console.log("ejecutando schema");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const groupSchema = new mongoose.Schema({
  grupo: {
    type: String,
    required: true,
  },
  tabla: [
    {
      position: {
        type: Number,
        required: true,
      },
      team: {
        id: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        shortName: {
          type: String,
          required: true,
        },
        tla: {
          type: String,
          required: true,
        },
        crest: {
          type: String,
          required: true,
        },
      },
      playedGames: {
        type: Number,
        required: true,
      },
      form: String,
      won: {
        type: Number,
        required: true,
      },
      draw: {
        type: Number,
        required: true,
      },
      lost: {
        type: Number,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      goalsFor: {
        type: Number,
        required: true,
      },
      goalsAgainst: {
        type: Number,
        required: true,
      },
      goalDifference: {
        type: Number,
      },
    },
  ],
});

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  usuario: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  hinchaDe: {
    type: String,
    default: "River Plate"
  }
})

const Usuario = mongoose.model('Usuario', UserSchema, 'Usuarios')

const Grupo = mongoose.model('Grupo', groupSchema, 'Grupos');

mongoose.connection.on('error', console.error.bind(console, 'Error de conexion:'));
// mongoose.connection.once('open', () => {
//   console.log('La base de datos está conectada a mongodb://127.0.0.1:27017/CopaLibertadores');
//   actualizarGrupos();
// });


module.exports.updateDB = function actualizarGrupos() {
  const Request = require("request");
  const tokenApi = 'c0d08cded27945d9b666d431cc3346ef';
  const options = {
    url: 'https://api.football-data.org/v4/competitions/CLI/standings',
    headers: { 'X-Auth-Token': tokenApi },
    rejectUnauthorized: false
  };

  function makeRequest(options) {
    return new Promise((resolve, reject) => {
      Request.get(options, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }


  async function updateStandingsToDatabase() {
    try {
      const response = await makeRequest(options);
      if (response && response.standings && response.standings.length > 0) {
        for (let obj of response.standings) {
          console.log("El grupo es: " + obj.group);
          await Grupo.findOneAndUpdate({ grupo: obj.group }, { $set: { tabla: obj.table } }, { new: true });
          console.log('Documento actualizado');
        }
      }
    } catch (error) {
      console.log('Error al actualizar documento:', error);
    } finally {
      mongoose.connection.close(); // Cierra la conexión a la base de datos
    }

  }
  updateStandingsToDatabase()
}

// Metodos de retorno para la API

// Collection Grupo

module.exports.findEquipos = async () => {
  try {
    var equipos = await Grupo.find({}).lean();
    let nombres = ""
    equipos[0].standings.forEach(elem => {
      elem.table.forEach(table => {
        nombres += table.team.shortName + "\n"
      })

    });
    return nombres
  } catch (error) {
    console.error('Error al buscar equipos:', error);
    throw error;
  }
};

module.exports.findEquipo = async () => {
  try {
    var equipos = await Grupo.find({}).lean();
    let nombres
    equipos[0].standings.forEach(elem => {
      elem.table.forEach(table => {
        nombres += table.team.shortName + "\n"
      })

    });
    return nombres
  } catch (error) {
    console.error('Error al buscar equipos:', error);
    throw error;
  }
};

module.exports.getGrupos = async () => {
  try {
    var equipos = await Grupo.find({}).lean();

    let grupos = ""
    equipos[0].standings.forEach(elem => {

      elem.table.forEach(table => {
        grupos += JSON.stringify(table) + "\n" + "\n"  //+ ' ' +table.position + ' ' + table.playedGames+ ' ' +  table.won + ' ' + table.draw+ ' ' + table.lost+ ' ' + table.goalsFor+ ' ' + table.goalsAgainst+ ' ' + table.goalDifference + "\n"
      })

    });
    return JSON.stringify(equipos[0].standings)
  } catch (error) {
    console.error('Error al buscar equipos:', error);
    throw error;
  }
};

module.exports.getGrupo = async (grupo) => {
  try {
    var elGrupo
    var esteGrupo = await Grupo.find({}).lean();
    esteGrupo[0].standings.forEach(elem => {
      console.log(elem.group)
      if (elem.group == grupo) {
        elGrupo = elem;
      }

    })
    return elGrupo
  } catch (error) {
    console.error('Error al buscar equipos:', error);
    throw error;
  }
};

module.exports.getEquipo = async (equipo) => {
  try {
    var elEquipo
    var esteEquipo = await Grupo.find({}).lean();
    esteEquipo[0].standings.forEach(elem => {
      elem.table.forEach(elemEquipo => {
        if (elemEquipo.team.name == equipo)
          elEquipo = elemEquipo;
      })
    })
    return elEquipo
  } catch (error) {
    console.error('Error al buscar equipos:', error);
    throw error;
  }

};

//Collection Usuarios

module.exports.findUser = async (n) => {
  try {
    return await Usuario.find({ nombre: n }).lean();
  } catch (error) {
    console.error('Error al buscar el Usuario');
    return 400
  }
};

module.exports.findUserCuadro = async (n) => {

  try {
    const usuario = await Usuario.findOne({ nombre: n });
    return usuario.hinchaDe;
  }
  catch (error) {
    console.error("Error al buscar el Usuario, posiblemente el usuario ingresado no existe. \n A continuacion el error: \n", error);
    return 400;
  }
};

module.exports.findUsers = async () => {
  try {
    return await Usuario.find({}).lean();
  } catch (error) {
    console.error('Error al buscar Usuarios', error);
    throw error;
  }
};


module.exports.postUsuario = async (jUser, pass) => {

  try {
    const existeUsuario = await Usuario.findOne({ usuario: jUser.usuario })
    if (existeUsuario) {
      return 401;
    }
    else {
      let nuevoUsuario = new Usuario({
        nombre: jUser.nombre,
        usuario: jUser.usuario,
        password: pass
      })
      if ('hinchaDe' in jUser) {
        nuevoUsuario.hinchaDe = jUser.hinchaDe;
      }
      Usuario.create(nuevoUsuario)
        .then((usuarioGuardado) => {
          console.log('Usuario guardado en la base de datos:', usuarioGuardado);
        })
        .catch((error) => {
          console.error(error);
        });
      return 201;
    }

  } catch (error) {
    console.error("Error tratando de guardar un nuevo usuario")
  }
};

async function actualizarUsuario(jUser) {

  /* se debe controlar desde el front end, que lleguen los campos correctos. Los validos son
     nombre, usuario, password, e hinchaDe
  */

  for (let campo in jUser) {
    if (jUser.hasOwnProperty(campo)) {
      const valor = jUser[campo];
      if (campo == 'nuevoUsuario') {
        let duplicado = await Usuario.find({usuario: valor})
        if ((duplicado).length > 0)
          return 400
        await Usuario.findOneAndUpdate(
          { usuario: jUser.usuario },
          { $set: { usuario: valor } },
          { new: true })
      }
      else {
        await Usuario.findOneAndUpdate(
          { usuario: jUser.usuario },
          { $set: { [campo]: valor } },
          { new: true })
      }
    }
  }
}

module.exports.patchUsuario = async (jUser) => {

  try {
    const existeUsuario = await Usuario.findOne({ usuario: jUser.usuario })
    if (existeUsuario) {
      let rta = await actualizarUsuario(jUser)
      if (rta == 400)
        return 400
      else
        return 200
    }
    else
        return 404
  } catch (error) {
    console.log("no existe el usuario")
    console.error(error)
  }
};


module.exports.deleteUsuario = async (jUser) => {
  try {
    const usuarioEliminado = await Usuario.findOneAndDelete({ usuario: jUser.usuario });

    if (usuarioEliminado) {
      console.log("Usuario eliminado:", usuarioEliminado);
      return '201'; // Usuario eliminado correctamente
    } else {
      console.log("Usuario no encontrado");
      return '404'; // Usuario no encontrado
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return '400'; // Error al eliminar el usuario
  }
};