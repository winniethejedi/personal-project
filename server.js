const path = require('path');
const express = require('express');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const addGlobalMiddleware = require('./middleware/global.middleware');
const addRoutes = require('./routes/global.routes');

const app = express();

addGlobalMiddleware(app);
addRoutes(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('this port is awesome', port)
});