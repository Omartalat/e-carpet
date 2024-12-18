const Sequelize = require('sequelize');

// Create a new Sequelize instance to connect to the MySQL database
// dialect: 'mysql',
// Username: root
// Password: root
const sequelize = new Sequelize("ecarpet", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
