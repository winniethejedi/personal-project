const express = require('express');

const AuthRouter = require('./auth.routes');
const ApiRouter = require('./api.routes');

function addRoutes(app) {
    app.use('/auth', AuthRouter);
    app.use('/api', ApiRouter);
    
    return app;
}

module.exports = addRoutes;