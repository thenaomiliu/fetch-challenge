const express = require('express');
const bodyParser = require('body-parser');
const { v4:uuidv4 } = require('uuid');
const calculatePoints = require('./calculatePoints');

const app = express();
app.use(bodyParser.json());

// In memory storage for receipts
const receipts = {};

// Basic GET, ensure server is working
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// POST route to process receipts
app.post('/receipts/process', (req, res) => {
    const receipt = req.body; // Access the parsed JSON data from the request body
    const id = uuidv4();
    const points = calculatePoints(receipt);
    receipts[id] = { receipt, points }; // Logs receipt
    res.status(200).send({ "id" : id }); // Returns JSON object w/ generated ID
});

// GET route to look up receipt by ID and return JSON object of points awarded
app.get('/receipts/:id/points', (req, res) => {
    const id = req.params.id;

    if (receipts[id]) {
        res.status(200).send({ "points": receipts[id].points });
    } else {
        res.status(404).send({ error: 'Receipt not found' });
    }
});

//Server set up
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Start the server
});