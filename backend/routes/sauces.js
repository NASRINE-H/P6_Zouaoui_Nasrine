//on trouve la logique de routing (les routes pour les sauces )
// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();
// Ajout des middleweares

const auth = require('../middleware/auth');
//middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');
//  on importe le controller
const saucesCtrl = require('../controllers/sauces');


// Route qui permet de créer "une sauce"

router.post('/', auth, multer, saucesCtrl.createSauce);

// Route qui permet de cliquer sur une des sauces précise

router.get('/:id', auth, saucesCtrl.getOneSauce);

// Route qui permet de modifier "une sauce"

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Route qui permet de supprimer "une sauce"

router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Route qui permet de récupérer toutes les sauces

router.get('/', auth, saucesCtrl.getAllSauces);
// Route qui permet de gérer les likes des sauces

router.post('/:id/like', auth, saucesCtrl.likeDislikeSauce);

module.exports = router;