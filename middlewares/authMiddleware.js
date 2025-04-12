const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

module.exports = (requiredRoles) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.sub);

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      // Verificação de roles
      if (requiredRoles.includes('SELF')) {
        if (req.params.id && user.id !== req.params.id && user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Acesso negado' });
        }
      } else if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Permissão insuficiente' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
};