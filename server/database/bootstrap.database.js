const massive = require('massive');

let db;

massive(process.env.DATABASE_URL)
    .then((db) => {
        console.log('The server is connected to the database');
        app.set('db', db);
    })
    .catch(err => {
        console.warn('Failed to connect to the database:');
        console.error(err);
    });

    function getDb() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(Error('No database!'));
            }
            
            resolve(db);
        });
    }

module.exports = {
    getDb,
}