const { Sequelize } = require('sequelize');
const { loadDatabaseConfig } = require('./database');

async function initializeSequelize() {
  const config = await loadDatabaseConfig();

  const sequelize = new Sequelize('usuarios_db', config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialetic,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      idle: config.pool.idle,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });

  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }

  return sequelize;
}

module.exports = initializeSequelize;