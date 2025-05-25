const { Sequelize, DataTypes } = require('sequelize');
const { configureDatabase } = require('./database');
const { fetchRemoteConfig } = require('../service/configService');
const fs = require('fs');
const path = require('path');

async function initializeSequelize() {
  const remoteConfig = await fetchRemoteConfig();
  let sequelizeInstance;

  if (remoteConfig) {
    const databaseConfig = await configureDatabase(remoteConfig);
    console.log('Configurações do banco de dados para Sequelize:', databaseConfig);

    sequelizeInstance = new Sequelize(
      databaseConfig.database,
      databaseConfig.username,
      databaseConfig.password,
      {
        host: databaseConfig.host,
        port: databaseConfig.port,
        dialect: databaseConfig.dialect,
        pool: databaseConfig.pool,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
      }
    );
  } else {
    console.error('❌ Falha ao carregar as configurações remotas para o Sequelize. A inicialização do banco de dados falhará.');
    throw new Error('Falha ao carregar as configurações remotas do banco de dados.');
  }

  // Carregar todos os modelos da pasta 'models'
  const models = {};
  const modelsDir = path.join(__dirname, '../models');
  fs.readdirSync(modelsDir)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
    .forEach(file => {
      const model = require(path.join(modelsDir, file))(sequelizeInstance, DataTypes);
      models[model.name] = model;
    });

  sequelizeInstance.models = models;

  // Associar os modelos (se houver associações definidas em seus modelos)
  Object.keys(sequelizeInstance.models).forEach(modelName => {
    if (sequelizeInstance.models[modelName].associate) {
      sequelizeInstance.models[modelName].associate(sequelizeInstance.models);
    }
  });

  try {
    await sequelizeInstance.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    throw error;
  }

  return sequelizeInstance;
}

module.exports = initializeSequelize;