const db = require("./");
const { Sequelize } = db;
const axios = require('axios');

//Models
const { User, Place, Meetup, MeetupUserStatus } = require("./models");
let seedUsers = [],
    seedMeetup,
    seedHome = [],
    seedWork = [],
    seedPlaces = [],
    GOOGLE_MAPS="AIzaSyAopJDwUG1vlrsZg94qP6yuPtzapUgYw8g";

db.sync({ force: true }).then(() => {
    seed();
});

const seed = () => {
    return (
        Promise.all([
            User.create({
                name: "Bob",
                email: "bob@capstone.com",
                password: "123",
                phone: "6462709493"
            }),
            User.create({
                name: "Boyoon",
                email: "boyoon@capstone.com",
                password: "123",
                phone: "6029992817"
            }),
            User.create({
                name: "AJ",
                email: "aj@capstone.com",
                password: "123",
                phone: "6462709493"
            }),
            User.create({
                name: "Han",
                email: "han@capstone.com",
                password: "123",
                phone: "6462709493"
            })
        ])
            .then(users => {
                seedUsers = users;
                return Promise.all([
                    users[0].setFriends([users[1], users[2], users[3]]),
                    users[1].setFriends([users[0], users[2], users[3]]),
                    users[2].setFriends([users[1], users[0], users[3]]),
                    users[3].setFriends([users[1], users[2], users[0]])
                ]);
            })
            .then(() => {
                return Promise.all([
                    Place.create({
                        name: "Home",
                        address: "220 W 121st St, New York, NY 10027",
                        googleId:
                            "EjEyMjAgVyAxMjFzdCBTdCwgTmV3IFlvcmssIE5ZIDEwMDI3LCBVbml0ZWQgU3RhdGVz",
                        lat: "40.8065406",
                        lng: "-73.9513683"
                    }),

                    Place.create({
                        name: "Home",
                        address: "20 W 102nd St, New York, NY 10025",
                        googleId: "ChIJz4_pciH2wokR5EB2oUdIe58",
                        lat: "40.7958548",
                        lng: "-73.9632335"
                    }),
                    Place.create({
                        name: "Home",
                        address: "1411 Broadway, New York, NY 10018",
                        googleId: "ChIJuwlnE6tZwokRazjpw03G7t4",
                        lat:  "40.7542267",
                        lng:  "-73.9875942"
                    }),
                    Place.create({
                        name: "Home",
                        address: "75 Maiden Ln, New York, NY 10038",
                        googleId:
                            "Ei83NSBNYWlkZW4gTG4sIE5ldyBZb3JrLCBOWSAxMDAzOCwgVW5pdGVkIFN0YXRlcw",
                        lat: 40.3,
                        lng: -74.3
                    }),

                    Place.create({
                        name: "Work",
                        address: "25 Park Pl, New York, NY 10007",
                        googleId:
                            "Ei0yNSBQYXJrIFBsLCBOZXcgWW9yaywgTlkgMTAwMDcsIFVuaXRlZCBTdGF0ZXM",
                        lat: 40.2,
                        lng: -74.45
                    }),
                    Place.create({
                        name: "Work",
                        address: "199 Chambers St, New York, NY 10007",
                        googleId:
                            "EjIxOTkgQ2hhbWJlcnMgU3QsIE5ldyBZb3JrLCBOWSAxMDAwNywgVW5pdGVkIFN0YXRlcw",
                        lat: 40.24,
                        lng: -74.6
                    }),
                    Place.create({
                        name: "Work",
                        address: "220 W 12th St, New York, NY 10014",
                        googleId:
                            "EjQyODItMjIwIFcgMTJ0aCBTdCwgTmV3IFlvcmssIE5ZIDEwMDE0LCBVbml0ZWQgU3RhdGVz",
                        lat: 40.79,
                        lng: -74.05
                    }),
                    Place.create({
                        name: "Work",
                        address: "113 W 60th St, New York, NY 10023",
                        googleId: "ChIJd5vpMl9YwokRCRMA410J6fc",
                        lat: 40.15,
                        lng: -74.9
                    })
                ]);
            })
            .then(places => {
                seedPlaces = places;
                seedHome = places.filter(place => place.name === "Home");
                seedWork = places.filter(place => place.name === "Work");
                return Promise.all([
                    seedUsers[0].addPlace([seedHome[0], seedWork[0]]),
                    seedUsers[1].addPlace([seedHome[1], seedWork[1]]),
                    seedUsers[2].addPlace([seedHome[2], seedWork[2]]),
                    seedUsers[3].addPlace([seedHome[3], seedWork[3]])
                ]);
            })
            .then(() => {
                let promises = seedPlaces.map(place => axios
                                            .get(
                                              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                                                place.address
                                              )}&key=${GOOGLE_MAPS}`
                                            )
                                  );
                return Promise.all(promises);
            })
            .then(results => {
                  let google_places = results.map(result => result.data);

                  let promises = seedPlaces.map((place, idx) => {
                    return place.update({
                        lat: google_places[idx].results[0].geometry.location.lat,
                        lng: google_places[idx].results[0].geometry.location.lng
                    });
                  });

                  return Promise.all(promises);
            })
            // For meetup seeding
            .then(() => {
                let meetTime = new Date();
                meetTime.setHours(23);
                meetTime.setMinutes(0);
                meetTime.setSeconds(0);
                meetTime.setMilliseconds(0);
                return Meetup.create({ time: meetTime });
            })
            .then(meetup => {
                let seedMeetup = meetup;
                return Promise.all([
                    // meetup.setPlace(seedPlaces[0]),
                    meetup.setUsers([1, 2]),
                    MeetupUserStatus.create({
                        initiator: true,
                        status: "initiated",
                        userId: seedUsers[0].id,
                        meetupId: meetup.id,
                        originId: seedHome[0].id
                    }),
                    MeetupUserStatus.create({
                        initiator: false,
                        status: "initiated",
                        userId: seedUsers[1].id,
                        meetupId: meetup.id
                    })
                ]);
            })
            .then(() => console.log("seeded!"))
            .then(() => db.close())
            .catch(err => {
                db.close();
                throw err;
            })
    );
};
