const db = require('../');
const { Sequelize } = db;

// Status of the meetup per user
// Meetup Status -- all participant
// * Initiated (all) -- When an User makes a new request, but the friend hasn't acted on it yet.
// * Received (all) -- When the friend okayed the request, but before venue recommendation.
// * Pending (Individual) -- When user submitted constraint. (Only for the user that did it) And when user submitted preferred recommendation, but pending the other party's approval.
// * Accepted (all) -- When a meetup recommendation is accepted by all party.
// * Rejected (all) -- no agreement is reached. Or the Friend declined a meetup request.
// * Canceled (all) -- when one party cancels the meetup.
const MeetupUserStatus = db.define('meetup_user_status', {
    initiator: Sequelize.BOOLEAN,
    status: Sequelize.ENUM('initiated', 'received', 'pending', 'accepted', 'rejected', 'canceled')
});

module.exports = MeetupUserStatus;
