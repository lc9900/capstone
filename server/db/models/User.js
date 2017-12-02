const db = require("../");
const { Sequelize } = db;

const User = db.define("user", {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true //isEmail covers notNull
    }
  },
  password: {
    type: Sequelize.STRING,
    len: [8, 40], //password must be atleast 8 char long
    allowNull: true // This is for users that logs into thru google
  },
  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  googleId: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  }
});

User.login = function(credential) {
  return User.findOne({
        where: credential,
        // include:[db.models.place, {
        //   model: User,
        //   as: 'friends'
        // }]
        include: [{all:true}, {
          model: db.models.meetup,
          include: [db.models.place]
        }]
    }).then(user => {
        if (user) {
            return user;
        }
        throw 'Invalid Login';
  });
};

User.findUser = function(userId) {
  return User.findOne({
        where: {
          id: userId
        },
        // include:[db.models.place, {
        //   model: User,
        //   as: 'friends'
        // }]
        include: [{all:true}, {
          model: db.models.meetup,
          include: [db.models.place]
        }]
    }).then(user => {
        if (user) {
            return user;
        }
        throw 'Invalid Login';
  });
};
module.exports = User;
