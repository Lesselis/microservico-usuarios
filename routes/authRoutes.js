const express = require('express');
const authController = require('../controllers/authController');
const { validateRegistration } = require('../validators/userValidator');

const router = express.Router();

// Rota de Registro (agora usa o controller e o validator)
router.post('/register', validateRegistration, authController.register);

// Rota de Login (vamos mover a lógica para um método 'login' no authController)
router.post('/login', authController.login);

module.exports = router;