const router = require("express").Router();
const { User, Meetup, MeetupUserStatus } = require("../db/models");
const Sms = require("../../utils/sms");

module.exports = router;

// Get a Meetup
// tested
router.get("/:id", (req, res, next) => {
    Meetup.findById(req.params.id * 1, { include: [User, MeetupUserStatus] })
        .then(meetup => {
            res.json(meetup);
        })
        .catch(next);
});

// get meetup with both users included in the query
router.get("/:id/includeUser", (req, res, next) => {
    Meetup.findAll({
        where: { id: req.params.id * 1 },
        include: [User]
    })
        .then(meetup => {
            res.json(meetup);
        })
        .catch(next);
});

// Add New Meetup.
// tested
router.post("/add/:userId", (req, res, next) => {
    if (!validateMeetupTime(req.body))
        return res.status(409).send("Scheduled Time is in the past!");
    Meetup.initiateMeetup(req.body, req.params.userId * 1)
        .then(() => {
            res.send("added");
        })
        .catch(err => {
            console.log("req body is ", req.body);
            console.log(err);
            res.status(409).send(err);
        });
});

// Update a Meetup -- modify or cancel
// The method will check for time conflict. If found, error is 409 will be sent.
// tested
router.put("/:id", (req, res, next) => {
    // if (!validateMeetupTime(req.body))
    //     return res.status(409).send("Scheduled Time is in the past!");
    const { user, friend, startTime, name } = req.body;
    let recipients = [user.phone, friend.phone];
    let message = `Rendezvous on ${startTime} for ${user.name} and ${friend.name} @ ${name}`;
    Meetup.updateMeetup(req.body, req.params.id * 1)
        .then(() => {
            let text = new Sms();
            return text.sendBulk(recipients, message);

        })
        .then(() => {
            return res.send("updated");
        })
        .catch(err => {
            console.log(err)
            return res.status(409).send(err);
        });
});

//Delete Meetup -- Not sure if that's needed
// meetup, MeetupUserStatus
// Because of association, entries in user_meetup_map is also removed implicitly
// tested
router.delete("/:id", (req, res, next) => {
    let targetMeetup;
    Meetup.findById(req.params.id * 1)
        .then(meetup => {
            targetMeetup = meetup;
            return MeetupUserStatus.destroy({
                where: { meetupId: meetup.id }
            });
        })
        .then(() => {
            return targetMeetup.destroy();
        })
        .then(() => res.send("deleted"))
        .catch(next);
});

// Validate the meetup time. Since this doesn't involve database interaction,
// it's moved here into the api.
function validateMeetupTime(data) {
    const { year, month, date, hour } = data;
    // let meetTime = new Date(year, month - 1, date, hour, 0, 0, 0);
    let meetTime = new Date(year, month, date, hour, 0, 0, 0);
    if (meetTime < new Date()) return false;

    return true;
}
