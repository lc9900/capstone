const db = require('./');
const { Sequelize } = db;

//Models
const {User, Place} = require('./models');
let seedUsers = [],
    seedPlaces = [];

db.sync({force:true})
    .then(() => {
        seed();
    })

const seed = () => {
    return Promise.all([
    User.create({ name: 'Bob', email: 'Bob@capstone.com', password: '123' }),
    User.create({ name: 'Boyoon', email: 'boyoon@capstone.com', password: '123' }),
    User.create({ name: 'AJ', email: 'aj@capstone.com', password: '123' }),
    User.create({ name: 'Han', email: 'han@capstone.com', password: '123' }),
  ])
    .then((users) => {
        seedUsers = users;
        return Promise.all([
            users[0].setFriends([users[1], users[2], users[3]]),
            users[1].setFriends([users[0], users[2], users[3]]),
            users[2].setFriends([users[1], users[0], users[3]]),
            users[3].setFriends([users[1], users[2], users[0]])
        ])
    })
    .then(() => {
        return Promise.all([
            Place.create({name: 'Home', address: '220 W 121st St, New York, NY 10027'}),
            Place.create({name: 'Home', address: '20 W 102nd St, New York, NY 10025'}),
            Place.create({name: 'Home', address: '1411 Broadway, New York, NY 10018'}),
            Place.create({name: 'Home', address: '75 Maiden Ln, New York, NY 10038'}),
        ]);
    })
    .then(places => {
        seedPlaces = places
        return Promise.all([
            seedUsers[0].addPlace(places[0]),
            seedUsers[1].addPlace(places[1]),
            seedUsers[2].addPlace(places[2]),
            seedUsers[3].addPlace(places[3])
        ]);
    })
    .then(() => console.log('seeded!'))
    .then(() => db.close())
    .catch(err => { throw err; });
}


