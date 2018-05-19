const express = require('express');

const handleDbError = require('../database/handleError.database');

const UserRouter = express.Router();

UserRouter.get('/user/me', (req, res) => {
    res.send({
        successful: req.isAuthenticated(),
        ...req.user
    })
});

UserRouter.get('/user', (req, res) => {
    const userId = parseInt(req.query.id, 10);
    req.db.users.findOne({
        id: userId
    })
        .then(user => {
            const userData = {
                id: user.id,
                profile_pic: user.profile_pic,
                username: user.username
            }
            res.send(userData);
        })
        .catch(handleDbError(res));
});

module.exports = UserRouter;