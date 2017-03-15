var isLoggedIn = require('./auth.js').isLoggedIn
var uploadImage = require('../uploadCloudinary.js').uploadImage
//var addHeaders = require('./auth.js').addHeaders
var Profile = require('./model.js').Profile
var cookieParser = require('cookie-parser')
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')
exports.setup = function(app) {
    app.use(cookieParser());
    //app.use(addHeaders);
     app.get('/', index)
     app.get('/status',isLoggedIn,getStatus)

     app.put('/status',isLoggedIn,putStatus)

     app.get('/statuses/:users*?',getUserStatus)

     app.get('/email/:user*?',isLoggedIn,getEmail)
     app.put('/email',isLoggedIn,putEmail)
     app.get('/zipcode/:user*?',isLoggedIn,getZipcode)
     app.put('/zipcode',isLoggedIn,putZipcode)
     app.get('/pictures/:user',isLoggedIn,getPictures)
     app.get('/pictures',isLoggedIn,getPicture)
     app.put('/picture',isLoggedIn,uploadImage,putPicture)
     app.get('/unlinkAcc',isLoggedIn,unlink)
     app.get('/favicon.ico',favicon)
}

function favicon(req,res){
  res.send('this is a stub')
}
function index(req, res) {
     res.send({helloooo:'woorld'})
}

function getStatus(req,res){// get the loggedIn user's status
  var username = req.username
  Profile.find({username:username}).exec(function(err, items) {
    res.send({statuses:[{username:username,status:items[0].status}]})
  })
}

// set a new status for the logged in user
function putStatus(req,res){
  var newstatus = req.body.status
  var username = req.username
  Profile.find({username:username}).exec(function(err, items) {
    items[0].status = newstatus
    items[0].save()
    res.send({statuses:[{username:username,status:newstatus}]})
  })


}
function getUserStatus(req,res){
  var users = req.params.users.split(',')// store all the input user into an array
  var statuses = []
  var statusJSON
  Profile.find({username:{$in:users}}).exec(function(err, items) {
    items.forEach(function(item) {
      var status = {username:item.username,status:item.status}
      statuses.push(status)
    })
    res.send({statuses:statuses})
  })
}
//get the email from database
function getEmail(req, res) {
  var username = req.params.user
  if (!username){
    username = req.username
  }
  Profile.find({username:username}).exec(function(err, items) {
    var email = items[0].email
    res.send({username:username,email:email})
  })

}
//update the email for loggedin user
function putEmail(req,res){
  var newemail = req.body.email
  var username = req.username
  Profile.find({username:username}).exec(function(err, items) {
    Profile.find({email:newemail}).exec(function(err,items){
      if (items.length>0){
        res.status(400).send('this email address was used')
      }
      else{
        items[0].email = newemail
        items[0].save()
        res.send({username:username,email:newemail})
      }
    })
  })

}

//get zipcode
function getZipcode(req,res){
  var username = req.params.user
  if (!username){
    username = req.username
  }
  Profile.find({username:username}).exec(function(err, items) {
    var zipcode = items[0].zipcode
    res.send({username:username,zipcode:zipcode})
  })
}

//update zipcode
function putZipcode(req,res){
  var newzipcode = req.body.zipcode
  var username = req.username
  Profile.find({username:username}).exec(function(err, items) {
    items[0].zipcode = newzipcode
    items[0].save()
    res.send({username:username,zipcode:newzipcode})
  })
}

//get the profile picture for the input username from database
function getPictures(req,res){
  var users = []
  var input = req.params.user
  if (Array.isArray(input)){// if the input user name is string, make it an array
    console.log('get pictures for multiple users')
    console.log(req.params.user)
    var users = req.params.user.split(',')
    }
  else {
    users.push(req.params.user)
  }
  var pictures = []
  Profile.find({username:{$in:users}}).exec(function(err, items) {
    items.forEach(function(item) {
      var picture = {username:item.username,picture:item.picture}
      pictures.push(picture)
    })
    console.log(pictures)
    res.send({pictures:pictures})
  })

  }

//stub for put picture
function putPicture(req,res){
  var uploadStream = cloudinary.uploader.upload_stream(function(result) {
    // create an image tag from the cloudinary upload

    // create a response to the user's upload
    //res.send('Done:<br/> <a href="' + result.url + '">' + image + '</a>');

    var username = req.username
    Profile.find({username:username}).exec(function(err, items){
      items[0].picture = result.url
      items[0].save()
      res.send({username:username,picture:result.url})
    })
  })

  var s = new stream.PassThrough()
  s.end(req.file.buffer)
  s.pipe(uploadStream)
  s.on('end', uploadStream.end)

}

// whenever this is no username input, get the profile picture for the loggedIn user.
function getPicture(req,res){
  var username = req.username
  var pictures = []
  Profile.find({username:username}).exec(function(err,items){
    var picture = {username:username,picture:items[0].picture}
    pictures.push(picture)
    res.send({pictures:pictures})
  })
}

function unlink(req,res){
  var username = req.username
  Profile.find({username:username}).exec(function(err,items){
    if (items.length == 0){
      res.status(400).send('user not exist')
    }
    items[0].auth = ''
    items[0].save()
    res.redirect('http://localhost:8080/#/profile')
  })
}
