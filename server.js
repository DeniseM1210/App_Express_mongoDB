const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.use(express.static(__dirname));

mongoose.connect('mongodb+srv://denise:nanami777@mongodb.oub9alm.mongodb.net/?retryWrites=true&w=majority&appName=mongoDB');

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'Error de conexion a MongoDB'));

connection.once('open', ()=>{
    console.log('Conexion EXITOSA a MongoDB');
});

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
app.post('/alumnos', async (request, response)=>{
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
    response.status(201).json({exito:true});
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