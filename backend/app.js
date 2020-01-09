const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const reciepeRoutes = require('./routes/reciepe');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://blz:mrunal12@cluster0-nslbx.mongodb.net/reciepes?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to mongoose');
});

app.use('/images', express.static(path.join('backend/images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/reciepe', reciepeRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
