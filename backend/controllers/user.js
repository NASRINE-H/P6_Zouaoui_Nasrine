//on retrouve ici la logique métier en lien avec nos utilisateurs appliqué aux routes post pour les opérations 
//d'inscription et de connexion 

//  utilise l'algorithme bcrypt pour hasher le mot de passe 
const bcrypt = require('bcrypt');
// utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Middleware pour  un nouvel utilisateur


exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            const user = new User({

                email: req.body.email,

                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    res.status(200).json({
                        userId: user._id,


                        token: jwt.sign({
                                userId: user._id

                            },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};