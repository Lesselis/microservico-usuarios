const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(
        'ADMIN',
        'BIBLIOTECARIO_SENIOR',
        'BIBLIOTECARIO_PLENO',
        'USUARIO',
        'ESTAGIARIO'
      ),
      allowNull: false,
      defaultValue: 'USUARIO'
    },
    last_login: {
      type: DataTypes.DATE
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'users',
    underscored: true, 
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        if (user.role === 'ADMIN') {
          user.is_active = true; // Ativa admins automaticamente
        }
      }
    }
  });

  return user;
};