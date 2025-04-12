const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models/user');

// Registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validação básica
    if (!['ADMIN', 'BIBLIOTECARIO_SENIOR', 'BIBLIOTECARIO_PLENO', 'USUARIO', 'ESTAGIARIO'].includes(role)) {
      return res.status(400).json({ error: 'Role inválida' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro no registro' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ token });
});

module.exports = router;