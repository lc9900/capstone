const router = require('express').Router();
const {User, Meetup, MeetupUserStatus} = require('../db/models');

module.exports = router;

// Get a Meetup
// tested
router.get('/:id', (req, res, next) => {
    Meetup.findById(req.params.id * 1)
    .then(meetup => {
        res.json(meetup);
    })
    .catch(next);
})

// Add New Meetup.
// The method should check if there's already a meetup during that time.
// tested
router.post('/add/:userId', (req, res, next) => {
    Meetup.initiateMeetup(req.body, req.params.userId * 1)
        .then(() => {
            res.send("added");
        })
        .catch(err => {
            res.status(409).send(err);
        });
} )


// Update a Meetup -- modify or cancel
// tested
router.put('/:id', (req, res, next) => {
    Meetup.findById(req.params.id * 1)
    .then(meetup => {
        return meetup.update(req.body);
    })
    .then(() => res.send('updated'))
    .catch(next);
})

//Delete Meetup -- Not sure if that's needed
// meetup, MeetupUserStatus
// Because of association, entries in user_meetup_map is also removed implicitly
// tested
router.delete('/:id', (req, res, next) => {
    let targetMeetup ;
    Meetup.findById(req.params.id * 1)
    .then(meetup => {
        targetMeetup = meetup
        return MeetupUserStatus.destroy({
            where: { meetupId: meetup.id}
        });
    })
    .then(() => {
        return targetMeetup.destroy();
    })
    .then(() => res.send('deleted'))
    .catch(next);
})

