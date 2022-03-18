
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/stuff');


router.post('/', auth, stuffCtrl.createSauce);

router.get('/:id', auth, stuffCtrl.getOneSauce);

router.put('/:id', auth, stuffCtrl.modifySauce);

router.delete('/:id', auth, stuffCtrl.deleteSauce);

router.get('/', auth, stuffCtrl.getAllSauces);

module.exports = router;