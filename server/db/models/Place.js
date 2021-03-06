const db = require("../");
const { Sequelize } = db;

const Place = db.define("place", {
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  googleId: Sequelize.STRING,
  yelpId: Sequelize.INTEGER,
  lat: Sequelize.FLOAT,
  lng: Sequelize.FLOAT
});

module.exports = Place;
