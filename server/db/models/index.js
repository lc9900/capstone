const db = require('../');
const Sequelize = db.Sequelize;
const User = require('./User');


// Association
User.belongsToMany(User, {as: 'friends', through: 'userFriends'})

// Wrapper


module.exports = {
    User
}
