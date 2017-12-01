const queryString = require("query-string");
const axios = require("axios");

const router = require("express").Router();

module.exports = router;

// Tested
router.get("/search", (req, res, next) => {
  const { location } = req.query;
  console.log("location", location);
  getVenue(location)
    .then(result => {
      return res.send(result);
    })
    .catch(next);
});

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
function getVenue(location = "40.72796372948929, -74.00713130900606") {
  var parameters = {
    location,
    type: "restaurant",
    radius: 500,
    opennow: true,
    key: process.env.GOOGLE_MAPS
  };
  // console.log(queryString.stringify(parameters));
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${queryString.stringify(
    parameters
  )}`;
  console.log(url);
  return axios
    .get(url)
    .then(res => res.data)
    .then(({ results }) => {
      return results[0];
    })
    .catch(err => {
      throw err;
    });
}
