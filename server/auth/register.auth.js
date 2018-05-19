const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function configureRegister(passport) {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, (req, email, password, done) => {
        if (!email || !password) {
            return done('Email and password are required');
        }
    
        const username = req.body.username;
        const today = new Date();
    
    
        req.db.findUser({ username, email })
            .then(foundUser => {
                if (foundUser.length === 0) {
                    password = bcrypt.hashSync(password, bcrypt.genSaltSync(15));
    
                    req.db.users.insert({ email, password, username: req.body.username, join_date: today.toLocaleString(), profile_pic: req.body.profile_pic })
                        .then(user => {
                            delete user.password;
    
                            done(null, user);
                        })
                        .catch(err => done(err));
                }
                else return done('That email or username is already used')
            })
    }));
}

module.exports = configureRegister;