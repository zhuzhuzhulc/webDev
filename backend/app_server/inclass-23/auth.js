var User = require('./model.js').User

var md5 = require('md5')
var request = require('request')
var qs = require('querystring')
var express = require ('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;


exports.setup = function(app) {

  app.use(session({secret:'eccdfe7445a20932385cad927208227b'}))
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  app.post('/register',register)
  app.post('/login',login)
  //app.put('/logout',isLoggedIn,logout)
  app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}))
  app.get('/callback',passport.authenticate('facebook',{successRedirect:'/profile',failRedirect:'/fail'}))
  app.get('/profile',isLoggedIn,profile)
  app.get('/fail',fail)
  app.put('/logout',logout)


}
exports.isLoggedIn = isLoggedIn
var sessionUser = {}
var user = {}

var config = {
  clientSecret:'eccdfe7445a20932385cad927208227b',
  clientID:'169617730098162',
  callbackURL:'http://localhost:3000/callback'
}

//facebook login
passport.serializeUser(function(user,done){
  users[user.id] = users
  done(null,user.id)

})

passport.deserializeUser(function(id,done){
  var user = user[id]
  done(null,user)
})

passport.use(new FacebookStrategy(config,function(token,refreshToken,profile,done){
  process.nextTick(function(){
    return (null,profile)
  })
})
)
function register(req,res){
  console.log("******************************************************************")

  //console.log("!!!!"+req.body.password)
  //console.dir(req.body.username)
  var username = req.body.username
  var password = req.body.password
  var salt = Math.random.toString()
  var hash = md5(password+salt)
  new User({username: username, hash: hash,salt: salt}).save()
  res.send({result:'Success Register!',username:username})
}

function login(req,res){
  var username = req.body.username
  var password = req.body.password
  var cookieKey = 'sid'
  User.find().exec(function(err, items) {
    console.log('there are ' + items.length + ' entries')
    items.forEach(function(item) { console.log(item)})
  })
  User.find({username:username}).exec(function(err,items){
    console.log("found "+items[0].username)
    var salt = items[0].salt
    var hash = md5(password+salt)
    if (hash == items[0].hash){// correct password create cookie
      res.cookie(cookieKey,generateCode(username),{maxAge:3600*1000,httpOnly:true})
      var msg = {username:username,result:'success Login'}
      res.send(msg)
    }
    else{
      res.send({msg:'wrong password or user not exist'})
    }
  })
}

function isLoggedIn(req,res,next){
  var cookieKey = 'sid'
  var sid = req.cookies[cookieKey]
  if (req.isAuthenticated()){
  return   next()
  }else {
    res.redirect('/login')
  }

  if (!sid){
    return res.sendStatus(401)

  }
  var username = sessionUser[sid]
  if (username){
    req.username = username
    return next()
  }
  else{
    res.sendStatus(401)
  }
}

function logout(req,res){
  req.logout()
  console.log('loggging out')
  sessionUser = {}
  res.send({msg:"OK"})
  //res.redirect('/')
}

function profile(req,res){
  res.send('ok now what',req.user)
}

function generateCode(username){
  var sessionId = Date.now()
  sessionUser[sessionId] = username
  return sessionId
}
function fail(req,res){
  res.send('fail')
}
