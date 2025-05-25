require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { fetchRemoteConfig } = require('./service/configService');
const { configureDatabase } = require('./config/database');

async function main() {
  let sequelize;
  const remoteConfig = await fetchRemoteConfig();

  if (remoteConfig) {
    console.log('Configurações remotas carregadas com sucesso.');
    const databaseConfig = await configureDatabase(remoteConfig);

    sequelize = new Sequelize(databaseConfig);

    try {
      await sequelize.authenticate();
      sequelize.authenticated = true;
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco de dados:', error);
      sequelize.authenticated = false;
    }
  } else {
    console.error('❌ Falha ao carregar as configurações remotas. A aplicação não será iniciada.');
    process.exit(1); // Encerra a aplicação em caso de falha na configuração
    return;
  }

  const app = express();

  // Middlewares globais
  app.use(express.json());

  // Injeta sequelize nas rotas através do middleware
  app.use((req, res, next) => {
    req.sequelize = sequelize;
    next();
  });

  // Rotas principais
  app.use('/', routes); // Monta o roteador principal no path '/'

  // Health Check (agora usa o flag sequelize.authenticated)
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      dbStatus: sequelize && sequelize.authenticated ? 'connected' : 'disconnected'
    });
  });

  // Middleware de tratamento de erros centralizado (deve ser o último middleware antes de iniciar o servidor)
  app.use(errorHandler);

  // Inicialização do servidor
  const PORT = process.env.API_PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
  });

  // Tratamento de sinais para shutdown graceful
  process.on('SIGTERM', () => {
    console.log('⚠️ Sinal de término recebido. Encerrando o servidor...');
    server.close(async () => {
      if (sequelize) {
        await sequelize.close();
        console.log('Database connection closed.');
      }
      console.log('✅ Servidor encerrado.');
      process.exit(0);
    });
  });

  module.exports = app;
}

main();