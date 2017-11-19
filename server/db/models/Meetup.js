const db = require('../');
const { Sequelize } = db;

const Meetup = db.define('meetup', {
    // location: Sequelize.STRING, // Since this links to Place, we don't need it
    time: Sequelize.DATE // TIMESTAMP WITH TIME ZONE for postgres
});

// Assuming data is { year, month, date, hour, friendId}
// tested
Meetup.initiateMeetup = function(data, initiatorId) {
    const {year, month, date, hour, friendId} = data;
    // Javascript's Date's month is 0-based,
    // So if user specify December, javascript knows it as 11 (12 - 1)
    let meetTime = new Date(year, month - 1, date, hour, 0, 0, 0),
        target_meetup
    return Promise.all([
                this.checkConflict(meetTime, initiatorId),
                this.checkConflict(meetTime, friendId)
            ])
            .then(([initiator_conflict, friend_conflict]) => {
                if (initiator_conflict) throw 'You have scheduling conflict';
                if (friend_conflict) throw 'Your friend has scheduling conflict';

                return this.create({time: meetTime});
            })
            .then(meetup => {
                target_meetup = meetup;
                return Promise.all([
                            db.models.meetup_user_status.create({
                                initiator: true,
                                status: "initiated",
                                meetupId: meetup.id,
                                userId: initiatorId
                            }),
                            db.models.meetup_user_status.create({
                                initiator: false,
                                status: "initiated",
                                meetupId: meetup.id,
                                userId: friendId
                            }),
                            meetup.setUsers([initiatorId, friendId])
                        ]);
            });
};

// tested
Meetup.checkConflict = function(meetTime, userId) {
    return db.models.user.findById(userId)
              .then(user => {
                return user.getMeetups({
                  where: {
                    time: meetTime
                  }
                });
              })
              .then(result => {
                    if(result.length) return true;
                    else return false;
              });
};

module.exports = Meetup;
