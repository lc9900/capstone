const router = require('express').Router();
module.exports = router;

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/meetup', require('./meetup'));
router.use('/place', require('./place'));
router.use('/venue', require('./venue'));
