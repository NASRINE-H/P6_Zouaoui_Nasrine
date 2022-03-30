// Récupération du modèle 'sauce'
const Sauce = require('../models/sauce');
// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');

// Permet de créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
  // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);
// On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  delete sauceObject._id;
  // Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  // Sauvegarde de la sauce dans la base de données
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce enregistrée'
      });
    }
  )
   // On ajoute un code erreur en cas de problème
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}; 

// Permet de récupérer une seule sauce, identifiée par son id depuis la base MongoDB
 // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      // On modifie les données et on ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
    // Si la modification ne contient pas de nouvelle image
    sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(
      // On applique les paramètre de sauceObject
      {
        _id: req.params.id
      }, {
        ...sauceObject,
        _id: req.params.id
      }
    )
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }))
}
// Permet de modifier une sauce
/*exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

  } : {
    ...req.body
  };
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'sauce modifié !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};*/

// Permet de supprimer la sauce


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// Permet de récuperer toutes les sauces de la base MongoDB
 // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



// Permet de "liker"ou "dislaker" une sauce

exports.likeDislike = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like
  // On prend le userID
  let userId = req.body.userId
  // On prend l'id de la sauce
  let sauceId = req.params.id

  if (like === 1) { // Si il s'agit d'un like
    Sauce.updateOne({
        _id: sauceId
      }, {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        }, // On incrémente de 1
      })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    Sauce.updateOne( // S'il s'agit d'un dislike
        {
          _id: sauceId
        }, {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, // On incrémente de 1
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}