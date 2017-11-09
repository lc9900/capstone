const db = require('../');
const Sequelize = db.Sequelize;
const User = require('./User');
const Meetup = require('./Meetup');
const Place = require('./Place');

// Association
User.belongsToMany(User, {as: 'friends', through: 'user_friends_map'});
Meetup.belongsTo(Place);
Place.hasMany(Meetup);

Meetup.belongsToMany(User, {through: 'user_meetup_map'});
User.belongsToMany(Meetup, {through: 'user_meetup_map'});


// Wrapper


module.exports = {
    User, Meetup, Place
}
