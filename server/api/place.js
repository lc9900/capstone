const router = require('express').Router();
const {Place} = require('../db/models');

module.exports = router;

//get user info -- maximal amount of information

router.get('/', (req, res, next) => {
	Place.findAll({include: [{all:true}]})
    .then(result => res.send(result))
})
