const router = require('express').Router();
const {User, Meetup} = require('../db/models');

module.exports = router;

// router.get('/:id', (req, res, next) => {
//     User.findById(req.params.id)
//     .then(user => res.send(user))
// })


// Add New Meetup.
// The method should check if there's already a meetup during that time.
router.post('/', (req, res, next) => {

} )


// Update a Meetup
router.put('/:id', (req, res, next) => {
    Meetup.findById(req.params.id * 1)
    .then(meetup => {
        res.json(meetup)
    })
    .catch(next);
})

//Cancel Meetup
router.delete('/:id', (req, res, next) => {
    Meetup.findById(req.params.id * 1)
    .then(meetup => {
        return meetup.destroy();
    })
    .then(() => res.send('deleted'))
    .catch(next);
})

