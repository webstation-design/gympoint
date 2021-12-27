const bcrypt = require("bcryptjs");

module.exports = {
  up: function (queryInterface, Sequelize) {

    var plans = [];

    plans.push({
      title: "Start",
      duration: 1,
      price: 129,
      created_at: new Date(),
      updated_at: new Date()
    });

    plans.push({
      title: "Gold",
      duration: 3,
      price: 109,
      created_at: new Date(),
      updated_at: new Date()
    });

    plans.push({
      title: "Diamond",
      duration: 6,
      price: 89,
      created_at: new Date(),
      updated_at: new Date()
    });

    return queryInterface.bulkInsert('Plans', plans);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Plans', null, {});
  }
};