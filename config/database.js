async function configureDatabase(remoteConfig) {
  const databaseConfig = {};

  for (const key in remoteConfig) {
    if (key.startsWith('database.postgres.')) {
      const subKey = key.replace('database.postgres.', '');
      if (subKey.includes('pool.')) {
        const poolSubKey = subKey.replace('pool.', '');
        databaseConfig.pool = databaseConfig.pool || {};
        databaseConfig.pool[poolSubKey] = remoteConfig[key];
      } else {
        databaseConfig[subKey] = remoteConfig[key];
      }
    }
  }

  return {
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    dialect: databaseConfig.dialect,
    pool: databaseConfig.pool,
  };
}

module.exports = { configureDatabase };