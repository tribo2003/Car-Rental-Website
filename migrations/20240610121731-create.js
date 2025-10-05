'use strict';

const {Sequelize} = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Dailies', 'feedback', {
      type: Sequelize.STRING,
      allowNull:  false,
      unique:false,
      default:''

    });

  },

  down: async (queryInterface, Sequelize) => {
  }
};