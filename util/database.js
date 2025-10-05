const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('finalProj', 'root', 'Sam890530', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize