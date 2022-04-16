//La méthodeexpress.Router() nous permet de créer des routeurs séparés pour chaque route principale
// de notre application – nous y enregistrez ensuite les routes individuelles.



//la logique métier (les fonctions pour les appliquer sur nos routes sauce.js)
// Récupération du modèle 'sauce'
const Sauce = require('../models/sauce');

const fs = require('fs');
const sauce = require('../models/sauce');

//  créer une nouvelle sauce

exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce enregistrée'
            });
        }
    )

    .catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//récuperer une sauce 
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

// Permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
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
};



// supprimer la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//  récuperer toutes les sauces de la base MongoDB

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

//faire like ou deislike 
exports.likeDislikeSauce = (req, res, next) => {
    const like = req.body.like
    const sauceId = req.params.id
    const userId = req.body.userId
    switch (like) {
        case (1):
            // on teste le cas où on a reçu un like =1
            Sauce.updateOne({ _id: sauceId }, {
                    $inc: { likes: +1 },
                    $push: { usersLiked: userId },
                })
                .then(() => res.status(200).json({
                    message: "sauce like +1"
                }))
                .catch((error) => res.status(400).json({
                    error
                }))
            break;

        case (-1):
            // on teste le cas où on a reçu un like =-1 (dislike)
            Sauce.updateOne({ _id: sauceId }, {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: userId },
                })
                .then(() => res.status(200).json({
                    message: "sauce dislike +1"
                }))
                .catch((error) => res.status(400).json({
                    error
                }))
            break;

        case (0):
            // on teste le cas où on a reçu un like =0 (like/dislike supprimé)
            // on cherche le userId dans les liste usersLiked / usersDisliked
            Sauce.findOne({ _id: sauceId })
                .then(sauce => {
                    // on cherche le userId dans les liste usersLiked 
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, {
                                $inc: { likes: -1 }, // décrémenter compteur likes
                                $pull: { usersLiked: userId }, //supprimer le userID de la liste
                            })
                            .then(() => res.status(200).json({
                                message: 'Like removed!'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }))

                    }
                    // on cherche le userId dans les liste usersDisliked
                    else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, {
                                $inc: { dislikes: -1 }, // décrémenter compteur dislikes
                                $pull: { usersDisliked: userId }, //supprimer le userID de la liste
                            })
                            .then(() => res.status(200).json({
                                message: 'dislike removed!'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }))
                    }

                })
            break;

    }
}