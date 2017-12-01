const db = require("../");
const Sequelize = db.Sequelize;
const User = require("./User");
const Meetup = require("./Meetup");
const Place = require("./Place");
const MeetupUserStatus = require("./MeetupUserStatus");

// Association
User.belongsToMany(User, { as: "friends", through: "user_friends_map" });

// For user's place
User.belongsToMany(Place, { through: "user_place_map" });
Place.belongsToMany(User, { through: "user_place_map" });

// Meetup and place
Meetup.belongsTo(Place);
Place.hasMany(Meetup);

// Meetup and User
Meetup.belongsToMany(User, { through: "user_meetup_map" });
User.belongsToMany(Meetup, { through: "user_meetup_map" });

// Meetup status per user.
MeetupUserStatus.belongsTo(User);
MeetupUserStatus.belongsTo(Meetup);

MeetupUserStatus.belongsTo(Place, { as: "origin" });
User.hasMany(MeetupUserStatus, { as: "status" });
Meetup.hasMany(MeetupUserStatus);

// Wrapper

module.exports = {
  User,
  Meetup,
  Place,
  MeetupUserStatus
};
