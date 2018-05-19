const passport = require('passport');

const { getDb } = require('../database/bootstrap.database');

const configurLogin = require('./login.auth');
const configureRegister = require('./register.auth');

configurLogin(passport);
configureRegister(passport);

passport.serializeUser((user, done) => {
    if (!user) {
        done('No user');
    }

    done(null, user);
});

passport.deserializeUser((user, done) => {
    const db = app.get('db');

    if (!db) {
        return done('Internal Server Error');
    }

    db.users.findOne({ id: user.id })
        .then(user => {
            if (!user) {
                return done(null, false);
            }

            delete user.password;

            done(null, user);
        })
        .catch(err => done(err));
});

module.exports = passport;