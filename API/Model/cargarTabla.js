const { MongoClient } = require("mongodb");
const dbName = 'CopaLibertadores';
const uri = process.env.MONGO_URL;

var Request = require("request");
console.log("ejecutando cargar tabla");

const tokenApi = 'c0d08cded27945d9b666d431cc3346ef';
let respuesta;
const options = {
  url: 'https://api.football-data.org/v4/competitions/CLI/standings',
  headers: {'X-Auth-Token': tokenApi },
  rejectUnauthorized: false 
};

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    console.log("adentro del promise");
    Request.get(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        console.log("adentro del else del promise");
        resolve(JSON.parse(body));
      }
    });
  });
}


async function insertOrUpdateStandingsToDatabase() {
  try {
    const response = await makeRequest(options);

    if (response && response.standings && response.standings.length > 0) {
      console.log("adentro del if del makeRequest");

      console.log(response);

      const dbClient = new MongoClient(uri);
      await dbClient.connect();

      console.log('Antes de la llamada');
      const database = dbClient.db(dbName);
      const collection = database.collection("Grupos");
      const collectionUsuarios = database.collection("Usuarios");
      const existingUser = await collectionUsuarios.findOne();
      console.log('1');
      console.log(collection);
      if (!existingUser)
      collectionUsuarios.insertOne({
        nombre: "Lionel Andres Messi Cuccittini",
        usuario: "Lio",
        password: "Messi"
      })

      const existingData = await collection.findOne(); // Obtener los datos existentes

      if (existingData) {
        // Actualizar los datos existentes
        await collection.updateOne({}, { $set: { standings: response.standings } });
        console.log('2');
        console.log(collection);
        console.log('Datos actualizados exitosamente.');
      } else {
        // Insertar los datos si no existen previamente
        await collection.insertOne({ standings: response.standings });
        console.log('Datos insertados exitosamente.');
      }

      dbClient.close();
    } else {
      console.log('No hay datos en la respuesta.');
    }
  } catch (error) {
    console.log(error);
  }
}

insertOrUpdateStandingsToDatabase();

