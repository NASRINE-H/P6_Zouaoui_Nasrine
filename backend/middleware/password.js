const passwordValidator = require('password-validator');


//const passwordSchema = require('../models/password');
//Schéma de mot de passe plus sécure
const passwordSchema = new passwordValidator();
// Contraintes du mot de passe
passwordSchema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();

    } else {
        return res.status(400).json({ error: "mot de passe faux" })
    }
};