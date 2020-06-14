const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 3000;

const solver = require('./solver')

app.use(cors())
app.use(bodyParser.json())

app.post('/api/solve', function (req, res) {
    res.json(solver.solveSudoku(req.body));
});

app.listen(port, () => {
    console.log('###################################');
    console.log(`>> At full throttle on port ${port}!`);
    console.log('###################################\n');
});