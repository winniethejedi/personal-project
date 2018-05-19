const path = require('path');
const express = require('express');

require('dotenv').config({ path: path.join(__dirname, './.env') });

const addGlobalMiddleware = require('./server/middleware/global.middleware');
const addRoutes = require('./server/routes/global.routes');

const app = express();
app.use(express.static(path.join(__dirname, './build')));

addGlobalMiddleware(app);
addRoutes(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('this port is awesome', port)
});