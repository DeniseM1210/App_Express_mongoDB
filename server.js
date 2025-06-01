const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa'))
  .catch((error) => console.error('Error al conectarse', error));



// ---------------- Crear el MODELO de datos ---------------
const alumnoSchema = new mongoose.Schema({
    numControl : String,
    nombre : String,
    primerAp : String,
    segundoAp : String,
    fechaNac : String,
    semestre : { type: Number, min: 1, max: 15 },
    carrera : String
});

const Alumno = mongoose.model('Alumno', alumnoSchema);

//==================== RUTAS =============================
app.get('/', async (request, response)=>{
    response.sendFile(__dirname + '/alumnos.html');
});

//---- Altas
app.post('/alumnos', async (request, response) => {
    try {
        const alumno = new Alumno({
            numControl : request.body.numControl,
            nombre : request.body.nombre,
            primerAp : request.body.primerAp,
            segundoAp : request.body.segundoAp,
            fechaNac : request.body.fechaNac,
            semestre : request.body.semestre,
            carrera : request.body.carrera
        });

        const nuevoAlumno = await alumno.save();
        response.status(201).json({ exito: true });
    } catch (error) {
        console.error('Error al guardar alumno:', error);
        response.status(500).json({ exito: false, error: error.message });
    }
});

//-----BAJAS
app.delete('/alumnos/:id', async (request, response) => {
    const alumnoId = request.params.id;
    // Fetch the user from the database
    const alumno = await Alumno.findById(alumnoId);
    await alumno.deleteOne();
    response.status(200).json({ message : 'Registro ELIMINADO' });
});

//-----CAMBIOS
app.put('/alumnos/:id', async (request, response) => {
    const alumnoId = request.params.id;
    // Fetch the user from the database
    const alumno = await Alumno.findById(alumnoId);
    alumno.nombre = request.body.nombre,
    alumno.primerAp = request.body.primerAp,
    alumno.segundoAp = request.body.segundoAp,
    alumno.fechaNac = request.body.fechaNac,
    alumno.semestre = request.body.semestre,
    alumno.carrera = request.body.carrera

    const updatedItem = await alumno.save();
    response.status(200).json(updatedItem);
});

//-----CONSULTAS
app.get('/alumnos', async (request, response) => {
    const alumnos = await Alumno.find();
    response.status(200).json(alumnos);
});

app.get('/alumnos/:id', async (request, response) => {
    const alumno = await Alumno.findById(request.params.id);
    response.status(200).json(alumno);
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutando en el PUERTO: ${PORT}`);
});