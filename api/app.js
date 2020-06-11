const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;

const solver = require('./solver')

app.use(cors())

app.get('/', function (req, res) {
    res.json(solver.solveSudoku());
});

app.listen(port, () => {
    console.log('###################################');
    console.log(`>> At full throttle on port ${port}!`);
    console.log('###################################\n');
});