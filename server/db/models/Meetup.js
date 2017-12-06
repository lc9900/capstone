const db = require('../');
const { Sequelize } = db;
const Op = Sequelize.Op;
const moment = require('moment-timezone');

const Meetup = db.define('meetup', {
    // location: Sequelize.STRING, // Since this links to Place, we don't need it
    time: Sequelize.DATE // TIMESTAMP WITH TIME ZONE for postgres
});

// Assuming data is { year, month, date, hour, friendId, originId}
// tested
Meetup.initiateMeetup = function(data, initiatorId) {
    const {year, month, date, hour, friendId, originId} = data;
    // console.log('Inside initiateMeetup')
    // Javascript's Date's month is 0-based,
    // So if user specify 12(december), javascript knows it as 11 (12 - 1)
    // which is why it's month -1 below
    // let meetTime = new Date(year, month - 1, date, hour, 0, 0, 0),
    let input = `${year}-${month}-${date} ${hour}:00:00`;
    console.log("input: ", input);
    let meetTime = moment.tz(input, 'YYYYMMDDHH:SS','America/New_York').utc().format(),
        target_meetup;

    // console.log("meetupTime: ", meetTime);

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
                                userId: initiatorId,
                                originId: originId
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

// Update meetup
// tested
Meetup.updateMeetup = function(data, meetupId) {
    // If meet time is update, then need to check for scheduling conflict.
    // The check should ignore the conflict itself
    // const {year, month, date, hour, placeId, status} = data;
    const {googleId, status, originId, userId, name, address, lat, lng} = data;
    // let meetTime = new Date(year, month - 1, date, hour, 0, 0, 0),
    //     target_meetup;
    let target_meetup;

    return Meetup.findById(meetupId)
        .then(meetup => {
            target_meetup = meetup;
            return meetup.getUsers();
        })
        // .then(users => {
        //     let userPromises = users.map(user => Meetup.checkConflict(meetTime, user.id, meetupId));
        //     return Promise.all(userPromises);
        // })
        // .then(conflicts => {
        //     // If checkConflict returns true for anyone, then throw error and
        //     // not update
        //     if(conflicts.indexOf(true) !== -1 ) {
        //         throw 'Scheduling conflict(s) found!';
        //     }

        //     // If no conflict is found, then update Meetup model
        //     return target_meetup.update({time: meetTime, placeId});
        // })
        .then(() => {
            return db.models.place.findOrCreate({
                where: { googleId },
                defaults: {
                    name, address, lat, lng
                }
            });
        })
        .then(([place, created]) => {
            return target_meetup.update({placeId: place.id});
        })
        .then(() => {
            // Got to update status
            return db.models.meetup_user_status.update({status}, {
                where: { meetupId: target_meetup.id }
            })
        }).then(() => {
            return db.models.meetup_user_status.update({originId}, {
                where: {
                    meetupId: target_meetup.id,
                    userId: userId
                }
            })
        })
}

// tested
Meetup.checkConflict = function(meetTime, userId, meetupId = 0) {
    return db.models.user.findById(userId)
              .then(user => {
                return user.getMeetups({
                  where: {
                    time: meetTime,
                    id: {
                        [Op.ne]: meetupId
                    }
                  }
                });
              })
              .then(result => {
                    if(result.length) return true;
                    else return false;
              });
};

module.exports = Meetup;
