const db = require('../');
const { Sequelize } = db;

const Meetup = db.define('meetup', {
    // location: Sequelize.STRING, // Since this links to Place, we don't need it
    time: Sequelize.DATE // TIMESTAMP WITH TIME ZONE for postgres
})

Meetup.addMeetup = function(data) {

}

module.exports = Meetup;
