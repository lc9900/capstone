const router = require('express').Router();
const {User} = require('../db/models');
const passport = require('passport');
// const User = require('../db/models/User'); // Doesn't work
// const db = require('../db');

require('dotenv').config();

// console.log("process.env.GOOGLE_CLIENT_SECRET=", process.env.GOOGLE_CLIENT_SECRET);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (userId, done) {
  User.findUser(userId)
  .then(function (user) {
    delete user.dataValues.password;
    user.dataValues.friends.forEach(friend => {delete friend.dataValues.password});
    done(null, user);
  })
  .catch(done);
});

router.post('/', (req, res, next) => {

    User.login(req.body)
        .then(user => {
            delete user.dataValues.password;
            user.dataValues.friends.forEach(friend => {delete friend.dataValues.password});
            // req.session.user = user;
            req.login(user, function(err) {
              if (err) { return next(err); }
              return res.send(user);
            });
            // console.log(user);
            // res.send(user);
        })
        .catch(err => {
            console.log(err);
            res.status(401).send(err);
        });
});

router.post('/signup', (req, res, next) => {
    User.create(req.body)
        .then(user => {
            delete user.dataValues.password;
            user.dataValues.friends.forEach(friend => delete friend.dataValues.password);
            // req.session.user = user;
            req.login(user, function(err) {
              if (err) { return next(err); }
              return res.send(user);
            });
            res.send(user);
        })
        .catch(next);
})

router.post('/logout', (req, res, next) => {
    delete req.session.user;
    // delete req.user;
    req.logout();
    res.send('logged out');
})

router.get('/me', (req, res, next) => {
    // if(req.session.user) return res.send(req.session.user);
    // console.log(req.user)
    if(req.user) return res.send(req.user);
    res.send({});
})

router.use('/google', require('./google.js'));

module.exports = router;
