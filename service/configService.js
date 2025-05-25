const axios = require('axios');

const configServerUrl = process.env.CONFIG_SERVER_URL;
const username = process.env.SPRING_SECURITY_USER_NAME;
const password = process.env.SPRING_SECURITY_USER_PASSWORD;
const configServerApplications = process.env.CONFIG_SERVER_APPLICATIONS ? process.env.CONFIG_SERVER_APPLICATIONS.split(',') : [];

async function fetchRemoteConfig() {
  const allConfigs = {};
  const auth = {
    username: username,
    password: password,
  };

  for (const appName of configServerApplications) {
    try {
      const url = `${configServerUrl}/${appName}/default`;
      const response = await axios.get(url, { auth: auth });
      const configData = response.data;
      if (configData && configData.propertySources) {
        const appConfigs = configData.propertySources.reduce((acc, source) => ({ ...acc, ...source.source }), {});
        Object.assign(allConfigs, appConfigs);
      } else {
        console.warn(`Resposta do config-server para ${appName} não continha 'propertySources'.`);
      }
    } catch (error) {
      console.error(`Erro ao buscar configurações para ${appName}:`, error.message);
    }
  }

  return Object.keys(allConfigs).length > 0 ? allConfigs : null;
}

module.exports = { fetchRemoteConfig };