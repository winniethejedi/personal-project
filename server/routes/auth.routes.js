const express = require('express');

const passport = require('../auth/bootstrap.auth');

const AuthRouter = express.Router();

AuthRouter.post('/api/auth/login', passport.authenticate(['login']), (req, res) => {
    res.send({
        success: true,
        message: 'Logged in successfully',
        email: req.user.email,
        username: req.user.username,
        profile_pic: req.user.profile_pic,
        id: req.user.id
    });

});

AuthRouter.post('/api/auth/register', passport.authenticate(['register']), (req, res) => {

    res.send({
        success: true,
        message: 'Registered successfully',
        email: req.user.email,
        username: req.user.username,
        profile_pic: req.user.profile_pic,
        id: req.user.id
    });
});

AuthRouter.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
});

module.exports = AuthRouter;