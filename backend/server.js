const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const path = require('path');

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Optional: serve index.html for base route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});


// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/pcbuild', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/builds', require('./routes/builds'));
app.use('/api/messages', require('./routes/messages'));


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
