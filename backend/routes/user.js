//la logique de routing (pour l'utilisateur)

const express = require('express');
// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();
// On associe les fonctions aux différentes routes, on importe le controller
const userCtrl = require('../controllers/user');

const Password = require('../middleware/Password');



router.post('/signup', Password, userCtrl.signup);
// Crée un nouvel utilisateur
// Vérifie les informations d'identification de l'utilisateur, enrenvoyant l'identifiant userID depuis la base de données et un TokenWeb JSON signé(contenant également l'identifiant userID)
router.post('/login', userCtrl.login);// Connecte un utilisateur

module.exports = router;