const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 3000;

const solver = require('./solver')
const generator = require('./generator')

app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/api/generate/', function (req, res) {
    res.json(generator.generateSudoku());
});
app.get('/api/generate/empty', function (req, res) {
    res.json(generator.generateEmptySudoku());
});

app.post('/api/solve', function (req, res) {
    res.json(solver.solveSudoku(req.body));
});

app.listen(port, () => {
    console.log('###################################');
    console.log(`>> At full throttle on port ${port}!`);
    console.log('###################################\n');
});