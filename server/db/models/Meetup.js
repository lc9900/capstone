const db = require('../');
const { Sequelize } = db;

const Meetup = db.define('meetup', {
    location: Sequelize.STRING,
    time: Sequelize.DATE // TIMESTAMP WITH TIME ZONE for postgres
})
