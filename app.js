require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// 1. Configuração do Sequelize
const sequelize = require('./config/sequelize');

// 2. Inicialização do Express
const app = express();

// 3. Middlewares essenciais
app.use(express.json());

// 4. Injeta sequelize nas rotas
app.use((req, res, next) => {
  req.sequelize = sequelize;
  next();
});

// 5. Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// 6. Health Check (simplificado)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    dbStatus: sequelize.authenticated ? 'connected' : 'disconnected'
  });
});

// 7. Tratamento de erros centralizado
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ 
    error: err.message || 'Erro interno',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 8. Inicialização do servidor
const PORT = process.env.API_PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
});

// 9. Tratamento de sinais para shutdown graceful
process.on('SIGTERM', () => {
  server.close(() => {
    sequelize.close();
    console.log('Servidor encerrado');
  });
});

module.exports = app;