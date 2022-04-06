// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();
// Ajout des middleweares
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');
// On associe les fonctions aux différentes routes, on importe le controller
const saucesCtrl = require('../controllers/sauces');


// Route qui permet de créer "une sauce"

router.post('/', auth, multer, saucesCtrl.createSauce);

// Route qui permet de cliquer sur une des sauces précise
// Renvoie la sauce avec l'ID fourni
router.get('/:id', auth, saucesCtrl.getOneSauce);

// Route qui permet de modifier "une sauce"
// Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, capturez-la et mettez à jour l'imageURL des sauces. Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande(req.body.name,req.body.heat etc). Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Route qui permet de supprimer "une sauce"
// Supprime la sauce avec l'ID fourni.
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// Route qui permet de récupérer toutes les sauces
// Renvoie le tableau de toutes les sauces dans la base de données
router.get('/', auth, saucesCtrl.getAllSauces);
// Route qui permet de gérer les likes des sauces
// Définit le statut "j'aime" pour userID fourni. Si j'aime = 1,l'utilisateur aime la sauce. Si j'aime = 0,l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime =-1, l'utilisateur n'aime pas la sauce.L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, engardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
router.post('/:id/like', auth, saucesCtrl.likeDislike);

module.exports = router;