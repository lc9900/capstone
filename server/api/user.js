const router = require('express').Router();
const {User, Meetup, Place} = require('../db/models');

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
//step 4: massaging to get friend's id and name through axios calls from Dashboard component
//step 5: need to refactor

router.get('/:id/meetups', (req, res, next) => {
	User.findById(req.params.id)
    .then(user => {
    	return user.getMeetups()
    	// return user.getStatus() //each object has my STATUS, userId and meetupId. but it doesn't give me the other person and will be hard to loop through.
    })
    .then(result => res.send(result))
})


///
///user - place api routes. 
///

//get places of user
router.get('/:userId/places', (req, res, next) => {
	User.findAll({
		where: {id: req.params.userId},
		include: [{model: Place}]
	})
	.then(user => res.send(user))
	.catch(next)
})

//create place of user
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
		return user.addPlace(newPlace)
	})
	.then(()=>res.sendStatus(204) )

})

//delete place of user
router.delete('/:userId/deletePlace/:placeId', (req, res, next) => {
	let selectedUser
	User.findById(req.params.userId)
	.then(user => {
		selectedUser = user
		return Place.findById(req.params.placeId)
	})
	.then(place => {
		return selectedUser.removePlace(place)
	})
	.then(()=>{res.sendStatus(204)})
	.catch(next)
})

