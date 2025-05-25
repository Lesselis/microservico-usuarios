const bcrypt = require('bcrypt');
const ApiError = require('../utils/apiError');

async function createUser(userData, sequelize) {
  const { name, email, password, role } = userData;

  try {
    // Gerar o hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar o novo usuário no banco de dados
    const newUser = await sequelize.models.user.create({
      name,
      email,
      password_hash: passwordHash,
      role
    });

    // Retornar o novo usuário (sem a senha hash por segurança)
    const { password_hash: removedPasswordHash, ...userWithoutPassword } = newUser.get();
    return userWithoutPassword;

  } catch (error) {
    console.error('Erro ao criar usuário no banco de dados:', error);
    throw new ApiError('Erro ao criar usuário', 500); // Lançar um erro amigável
  }
}

module.exports = { createUser };