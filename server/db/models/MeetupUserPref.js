const db = require('../');
const { Sequelize } = db;

// This table will contain user's preference, like place picks, budget, restaurant type, etc
const MeetupUserPref = db.define('meetup_user_pref', {
    place_ids: Sequelize.ARRAY(Sequelize.INTEGER)
})

module.exports = MeetupUserPref;
