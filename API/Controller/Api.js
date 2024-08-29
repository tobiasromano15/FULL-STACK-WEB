var express = require('express');
const routes = require('../Routes/routes')
const app = express()

app.use(express.json())
app.use(routes)

app.listen(3001)