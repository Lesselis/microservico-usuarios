const axios = require('axios');

const CONFIG_SERVER_URL = process.env.CONFIG_SERVER_URL;
const SPRING_APPLICATION_NAME = process.env.SPRING_APPLICATION_NAME;
const CONFIG_SERVER_USERNAME = process.env.SPRING_SECURITY_USER_NAME;
const CONFIG_SERVER_PASSWORD = process.env.SPRING_SECURITY_USER_PASSWORD;

async function loadDatabaseConfig() {
  try {
    const response = await axios.get(
      `${CONFIG_SERVER_URL}/${SPRING_APPLICATION_NAME}/default`, 
      {
        auth: {
          username: CONFIG_SERVER_USERNAME,
          password: CONFIG_SERVER_PASSWORD,
        },
      }
    );

    const databaseConfig = response.data.propertySources.find(
      (source) => source.name.includes('microservico-usuarios.yml')
    ).source.database.postgres;

    return {
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      dialetic: databaseConfig.dialect,
      pool: databaseConfig.pool,
    };
  } catch (error) {
    console.error('Erro ao carregar as configurações do banco de dados:', error);
    throw error;
  }
}

module.exports = { loadDatabaseConfig };