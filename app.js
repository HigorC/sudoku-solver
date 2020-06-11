const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('######################################');
    console.log(`>> At full throttle on port ${port}!`);
    console.log('######################################\n');
});