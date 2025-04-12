const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models/user');

// Listar usuários (apositivos ADMIN)
router.get('/', authMiddleware('ADMIN'), async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt']
  });
  res.json(users);
});

// Atualizar usuário (admin ou próprio usuário)
router.put('/:id', authMiddleware(['ADMIN', 'SELF']), async (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  
  // Só admin pode alterar roles
  if (req.body.role && req.user.role === 'ADMIN') {
    updates.role = req.body.role;
  }

  await User.update(updates, { where: { id: req.params.id } });
  res.json({ message: 'Usuário atualizado' });
});

// Rotas específicas para bibliotecários
router.get('/bibliotecarios', 
  authMiddleware(['ADMIN', 'BIBLIOTECARIO_SENIOR']), 
  async (req, res) => {
    const bibliotecarios = await User.findAll({
      where: {
        role: ['BIBLIOTECARIO_SENIOR', 'BIBLIOTECARIO_PLENO']
      }
    });
    res.json(bibliotecarios);
  }
);

module.exports = router;