require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USUARIOS_DB_USER,
    password: process.env.USUARIOS_DB_PASS,
    database: process.env.USUARIOS_DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres', 
    logging: console.log, // Mostra queries SQL no terminal durante desenvolvimento
    define: {
      underscored: true, // Usa snake_case em vez de camelCase
      timestamps: true   // Cria created_at e updated_at automaticamente
    }
  },
  test: {
    dialect: 'postgres',
    storage: ':memory:'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};