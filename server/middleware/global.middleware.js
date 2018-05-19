const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const passport = require('../auth/bootstrap.auth');
const checkDb = require('./checkDb.middleware');

function addGlobalMiddleware(app) {
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());

    app.use(session({
        name: 'personal-project',
        secret: process.env.SESSION_SECRET,
        cookie: {
            //days hours minutes seconds milseconds
            expires: 5 * 24 * 60 * 60 * 1000,
        },
        saveUninitialized: false,
        rolling: true,
        resave: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static(path.join(__dirname, '/build')));

    app.use(checkDb());

    return app;
}

module.exports = addGlobalMiddleware;