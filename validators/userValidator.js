const { body } = require('express-validator');

const validateRegistration = [
  body('name')
    .notEmpty()
    .withMessage('O nome é obrigatório')
    .isLength({ min: 2, max: 50 })
    .withMessage('O nome deve ter entre 2 e 50 caracteres'),
  body('email')
    .notEmpty()
    .withMessage('O email é obrigatório')
    .isEmail()
    .withMessage('O email deve ser válido'),
  body('password')
    .notEmpty()
    .withMessage('A senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('role')
    .optional() // A role é opcional, com um valor padrão no model
    .isIn(['ADMIN', 'BIBLIOTECARIO_SENIOR', 'BIBLIOTECARIO_PLENO', 'USUARIO', 'ESTAGIARIO'])
    .withMessage('Role inválida')
];

module.exports = { validateRegistration };