const { getDb } = require('../database/bootstrap.database');

function checkDb() {
    return (req, res, next) => {
        const db = app.get('db');

        if (db) {
            req.db = db;
            next();
        }
        else {
            res.status(500).send({ message: 'this died' });
        }
    };
}

module.exports = checkDb;