const { getDb } = require('../database/bootstrap.database');

function checkDb() {
    return (req, res, next) => {
        getDb()
            .then(db => {
                req.db = db;
                next();
            })
            .catch(err => {
                res.status(500).send({ message: 'this died' });
            });
    };
}

module.exports = checkDb;