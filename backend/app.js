// Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande, on importe donc body-parser

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://nasrine:nasrine@cluster0.efplu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  app.use(express.json());

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);

app.use('/api/auth', userRoutes);

module.exports = app;