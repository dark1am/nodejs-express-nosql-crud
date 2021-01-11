const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://dev:dev@localhost:27017/firstcrud', {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Conexion existosa a la BD');
})

connection.on('error', (err) => {
    console.log('Error en la conexion a la BD: ', err);
})

// Creacion del modelo:
const Firstcrud = mongoose.model('Firstcrud', {text: String, completed: Boolean});

app.post('/add', (req, res) => {
    const todo = new Firstcrud({text:req.body.text, completed: false})

    todo.save().then(doc => {
        console.log('Dato insertado correctamente...', doc);
    });

    res.json({response:'success'})

    .catch(err => {
        console.log('Error al insertar ', err.message);
        res.statusCode(400).json({response:'failed'})
    })
});

app.get('/getall', (req, res) => {
    Firstcrud.find({}, 'text completed')
    .then(doc => {
        res.json({response: 'success', data: doc});
    })
    .catch(err => {
        console.log('Error al consultar elementos ', err.message);
        res.statusCode(400).json({response:'failed'})
    });
})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    
    Firstcrud.findByIdAndDelete({_id:id})
    .then(doc => {
        res.json({response: 'success'})
    })
    .catch(err => {
        console.log('Error al eleminar dato ', err.message);
        res.statusCode(400).json({response: 'failed'})
    })
})

app.get('/complete/:id/:status', (req, res) => {
    const id = req.params.id;
    const status = req.params.status == 'true';

    Firstcrud.findByIdAndUpdate({_id:id} , {$set: {completed: status}})
        .then(doc => {
            res.json({response: 'success'});
        })
        .catch(err => {
            console.log('Error al actualizar el dato');
            res.json({response:'failed'})
        });
})

app.listen(3000, () => {
    console.log('servidor listo...');
});
