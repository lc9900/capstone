const db = require('../');
const { Sequelize } = db;

// Status of the meetup per user -- pending, accepted, rejected, past, etc.
const MeetupUserStatus = db.defined('meetup_user_status', {
    status: Sequelize.STRING
});

module.exports = MeetupUserStatus;
