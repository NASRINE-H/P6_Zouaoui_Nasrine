// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // unique pour que ce soit impossible s'inscrir plusieurs fois  avec la meme ,adresse email.
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);