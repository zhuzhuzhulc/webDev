var express = require('express')
var bodyParser = require('body-parser')
var favicon = require('serve-favicon');

var app = express()
app.use(bodyParser.json())
app.use(addHeaders)//use the middleware function
app.use(favicon('favicon.ico'))

if (process.env.NODE_ENV!= "production"){
  require('dot-env')
}
require('./uploadCloudinary.js').setup(app)
require('./app_server/profile.js').setup(app)
require('./app_server/post.js').setup(app)
require('./app_server/auth.js').setup(app)
require('./app_server/following.js').setup(app)
// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s',
               server.address().address,
               server.address().port)

})
//enable CORS, add this header to all the request so that frontend from a
//different origin will be able to access backend server.
function addHeaders(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin',req.headers.origin||'*')
    res.setHeader('Access-Control-Allow-Credentials','true')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIOINS')
    res.setHeader('Access-Control-Allow-Headers','Authorization,Location,X-Session-Id,Content-Type')
    if (req.method == "OPTIONS"){
       return res.sendStatus(200)
    }
    return next()
}
exports.addHeaders = addHeaders
