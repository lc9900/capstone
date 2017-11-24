const router = require('express').Router();
const {User, Meetup} = require('../db/models');

module.exports = router;

/*
going to need to show information per user:
"new incoming requests" - status: initiated, initiator: false
"Pending Outgoing Requests" - status: initiated, initiator: true
"accepted rendezvous" - 'received', 'pending', 'accepted', 
can make fourth catogory - 'canceled'
only show in "history" - 'rejected', 
*/

//get user info -- maximal amount of information

router.get('/:id', (req, res, next) => {
	User.findAll({where: {id:req.params.id}, include: [{all:true}]})
    .then(result => res.send(result[0]))
})

//step 1: get user's meetups
//step 2: get user's meetups with status attached
//step 3: oh no, just getting a user's meetups doesn't give me the friend's id?

router.get('/:id/meetups', (req, res, next) => {
	User.findById(req.params.id)
    .then(user => {
    	return user.getMeetups()
    	// return user.getStatus() //each object has my STATUS, userId and meetupId. but it doesn't give me the other person and will be hard to loop through.
    })
    .then(result => res.send(result))
})



///user - place api routes. no longer in use for mvp


router.get('/:userId/places', (req, res, next) => {
	User.findAll({
		where: {id: req.params.userId},
		include: [{model: Place}]
	})
	.then(user => res.send(user))
	.catch(next)
})


router.post('/:userId/newPlace/:address', (req, res, next) => {
	let newPlace
	Place.findOrCreate({
		where:{address: req.params.address}
	})
	.then(place => {
		newPlace = place[0]
	})
	.then(()=>{return User.findById(req.params.userId)})
	.then(user => {
		return user.setPlaces([newPlace])
	})
	.then(()=>res.sendStatus(204) )

})

// followed this model previously but it involved changes to model. should change. won't work right now
// https://stackoverflow.com/questions/30276237/how-to-remove-association-in-sequelize-without-extra-query
// models.exercise_muscle_tie.destroy({ where: { exerciseId: 1856, muscleId: 57344 } })

router.delete('/:userId/deletePlace/:placeId', (req, res, next) => {
	user_place_map.destroy({
		where: {placeId: req.params.placeId, userId: req.params.userId}
	})
	.then(()=>{res.sendStatus(204)})
	.catch(next)
})

