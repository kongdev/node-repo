

// Routes
const followRoute = require('./routes/followTags')
const publishRoute = require('./routes/publishTags')
// Lib 
const config = require('config');
const logger = require('morgan')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')



app.use(logger('dev'))
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(bodyParser.json())

app.get('/king', function (req, res) {
    console.log("kingkong");
    res.send('kong na ja')
})

const kongMiddleware = (req, res, next) => {
    console.log('kongMiddleware')
    next()
}

app.use('/follow', followRoute)
app.use('/publish', publishRoute)
app.listen(config.nodejs.port, () => {
    console.log('running port', config.nodejs.port)
})

