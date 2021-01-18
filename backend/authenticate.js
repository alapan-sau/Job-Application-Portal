var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var Users = require('./model/users')
var Recruiters = require('./model/recruiters');
var jwt = require('jsonwebtoken');

passport.use('userLocal', new LocalStrategy({usernameField: 'email'},Users.authenticate()));
passport.use('recruiterLocal', new LocalStrategy({usernameField: 'email'},Recruiters.authenticate()));


// passport.serializeUser(Users.serializeUser());
// passport.deserializeUser(Users.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
if(user!=null)
    done(null,user);
});

exports.getToken = function(user) {
    return jwt.sign(user, 'secret',
        {expiresIn: "12h"});
};

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use('userJWT',new JwtStrategy(opts, function(jwt_payload, done) {
    Users.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log(user);
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('userJWT', {session: false});

passport.use('recruiterJWT',new JwtStrategy(opts, function(jwt_payload, done) {
    Recruiters.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyRecruiter = passport.authenticate('recruiterJWT', {session: false});


