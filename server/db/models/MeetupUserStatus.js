const db = require('../');
const { Sequelize } = db;

// Status of the meetup per user

const MeetupUserStatus = db.define('meetup_user_status', {
    initiator: Sequelize.BOOLEAN,
    status: Sequelize.ENUM('initiated', 'received', 'pending', 'accepted', 'rejected', 'canceled')
});

module.exports = MeetupUserStatus;
