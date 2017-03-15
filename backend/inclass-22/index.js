var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())

require('./app_server/profile.js').setup(app)
require('./app_server/post.js').setup(app)
require('./app_server/auth.js').setup(app)
// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s',
               server.address().address,
               server.address().port)
    addHeaders(req,res,next)
})
function addHeaders(req, res, next) {
    res.setHeader('-Allow-Origin','http://localhost:3000')
    res.setHeader('-Credentials','true')
    res.setHeader('-Methods','GET,POST,PUT,DELETE')
    res.setHeader('-Headers','Authorization,Content-Type')
    if (req.method == "OPTIONS"){
       return res.sendStatus(200)
    }
    return next()
}
