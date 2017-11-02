const db = require('./server/db');
const { Sequelize } = db;

//Models
const {User} = require('./server/db/models');


db.sync({force:true})
    .then(() => {
        seed();
    })
const seed = () => {
    return Promise.all([
    User.create({ name: 'Rav', email: 'ravsworld@gmail.com', password: 'password' }),
    User.create({ name: 'Annie', email: 'annielovescode@gmail.com', password: 'password' }),
    User.create({ name: 'admin', email: 'admin@gmail.com', password: 'admin', admin: true })
  ])
    .then(() => console.log('seeded!'))
    .catch(err => { throw err; });
}


