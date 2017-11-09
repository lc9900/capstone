const db = require('../');
const { Sequelize } = db;

const Place = db.define('place', {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    googleId: Sequelize.INTEGER,
    yelpId: Sequelize.INTEGER
})
