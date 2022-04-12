// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, "Veuillez faire un mot de passe"] }
});
// Plugin pour garantir un email unique

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);