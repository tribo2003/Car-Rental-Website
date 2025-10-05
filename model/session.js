const {Sequelize} = require('sequelize')
const sequelize = require('../util/database')


const Session = sequelize.define('Session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    expires: {
        type: Sequelize.DATE
    },
    data: {
        type: Sequelize.TEXT
    }
});

module.exports  = Session