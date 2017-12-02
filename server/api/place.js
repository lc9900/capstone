const router = require("express").Router();
const { Place } = require("../db/models");
const axios = require("axios");

module.exports = router;

//get user info -- maximal amount of information

router.get("/", (req, res, next) => {
  Place.findAll({ include: [{ all: true }] }).then(result => res.send(result));
});

router.post("/", (req, res, next) => {
  const address = req.body.address;
  const name = req.body.name;
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.GOOGLE_MAPS}`
    )
    .then(place => {
      const result = place.data.results[0];
      Place.create({
        googleId: result.place_id,
        address: result.formatted_address,
        name,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      });
    })
    .then(message => res.send(message))
    .catch(next);
});
