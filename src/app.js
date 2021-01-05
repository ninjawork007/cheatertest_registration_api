const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const config = require("./config");

mongoose.connect(config.mongo.url, config.mongo.options)
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
    console.log(err.message);
    res.send({ success: false, message: 'Something failed!' });
});

const apiRoutes = require('./routes/api');
const { DefaultDeserializer } = require('v8');

app.use(apiRoutes);

app.listen(3000, () => { });





dfdsfdsf






