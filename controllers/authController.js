const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../service/userService');
const responses = require('../utils/responses');
const ApiError = require('../utils/apiError');
const { fetchRemoteConfig } = require('../service/configService');

// Função para garantir formato PEM corretamente
function formatPem(key) {
  if (!key) return key;
  if (key.includes('\n')) return key;
  return key
    .replace(/(-----BEGIN [A-Z ]+-----)/g, '$1\n')
    .replace(/(-----END [A-Z ]+-----)/g, '\n$1\n')
    .replace(/([^-])-----/g, '$1\n-----')
    .replace(/(.{64})/g, '$1\n');
}

let privateKeyPromise = null;

async function getPrivateKey() {
  if (!privateKeyPromise) {
    privateKeyPromise = fetchRemoteConfig().then(config => {
      const rawKey = config['jwt.privateKey'];
      return formatPem(rawKey);
    });
  }
  return privateKeyPromise;
}

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(responses.error(errors.array(), 'Erro de validação'));
  }

  const { name, email, password, role } = req.body;

  try {
    const existingUser = await req.sequelize.models.user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(responses.error('Email já cadastrado'));
    }

    const newUser = await userService.createUser({ name, email, password, role }, req.sequelize);
    return res.status(201).json(responses.success(newUser, 'Usuário criado com sucesso'));

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json(responses.error('Erro interno ao criar o usuário'));
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await req.sequelize.models.user.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json(responses.error('Credenciais inválidas'));
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json(responses.error('Credenciais inválidas'));
    }

    const privateKey = await getPrivateKey();

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        issuer: 'urn:library-auth'
      }
    );

    return res.json(responses.success({ token }, 'Login realizado com sucesso'));

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json(responses.error('Erro interno ao fazer login'));
  }
}

module.exports = { register, login };