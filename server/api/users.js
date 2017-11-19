const router = require('express').Router();
const {User} = require('../db/models');

module.exports = router;

router.get('/:id', (req, res, next) => {
	User.findById(req.params.id)
    .then(user => res.send(user))
})
