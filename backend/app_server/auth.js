var User = require('./model.js').User
var Profile = require('./model.js').Profile

var redis = require('redis').createClient(process.env.REDIS_URL)
var md5 = require('md5')
var request = require('request')
var qs = require('querystring')
var express = require ('express')
var session = require('express-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

var cookieParser = require('cookie-parser')
exports.setup = function(app) {

  app.use(cookieParser());
  app.use(session({secret:'eccdfe7445a20932385cad927208227b'}))
  app.use(passport.initialize());
  app.use(passport.session());



  app.post('/register',register)
  app.post('/login',login)
  app.get('/authfacebook',passport.authenticate('facebook',{scope:'email'}))
  app.get('/callback',passport.authenticate('facebook',{successRedirect:'/profile',failRedirect:'/fail'}))
  app.get('/profile',profile) // not sure if I need to check if its log in here.
  app.get('/fail',fail)
  app.put('/logout',isLoggedIn,logout)
  app.put('/password',isLoggedIn,changePassword)



}

var sessionUser = {}
var users = {}
var cookieKey = 'sid'

var config = {
  clientSecret:'eccdfe7445a20932385cad927208227b',
  clientID:'169617730098162',
  //callbackURL:'http://localhost:3000/callback',
  callbackURL:'http://cl40hw8.herokuapp.com/callback',
  profileFields:['email']
}

//facebook login
passport.serializeUser(function(user,done){
  users[user.id] = user
  done(null,user.id)

})

passport.deserializeUser(function(id,done){
  var user = users[id]
  done(null,user)
})

passport.use(new FacebookStrategy(config,function(token,refreshToken,profile,done){
  process.nextTick(function(){
    console.log("Auth done")
    done(null,profile)
    return (null,profile)
  })
})
)

/*check if the user is logged in. This middleware will be used for every endpoint
if the user is loggedIn, it can set the username in the req*/
function isLoggedIn(req,res,next){

  var sid = req.cookies[cookieKey]

  /*fb isLoggedIn*/
  if (req.isAuthenticated()){
    //this part will be reached if logged in with third party.

    var email = req.user.emails[0].value

    req.username = email

    return next()
  }
  else {
    //console('!')
    //res.redirect('/login')
    //return next()

  }
  //console.log('this middleware is not finished! cookie key is '+sid)
  if (!sid){
    return res.sendStatus(401)

  }
  //get the username using the session id from the session map
  var username = sessionUser[sid]
  redis.get(sid, function(err, username) {
    if (username){
      req.username = username
      return next()
    }
    else{// if no such user in the map, return unauthorized error
      res.sendStatus(401)
    }
  })
}
/*helper function that return hash given password and salt*/
function getHash(password,salt){
  return md5(password+salt)
}

/*create a new user in the Profile database with input email and zipcode
  a default profile pic and status will also be assigned to the new user*/
function register(req,res){
  var username = req.body.username
  var password = req.body.password
  var email = req.body.email
  var zipcode = req.body.zipcode
  var defaultpic = 'http://thumb1.shutterstock.com/display_pic_with_logo/1938752/221171704/stock-vector-cartoon-illustration-of-a-worried-little-pig-221171704.jpg'
  var defaultstatus = 'working on web development'

  if (!username || !password){
    res.sendStatus(400)
    return
  }
  // a query that check if the user is already in the profile database
  Profile.find({username:username}).exec(function(err, items) {
    if (items.length>0){
      res.status(400).send('user already exist')
      return
    }
    else {
      Profile.find({email:email}).exec(function(err,items){
        if (items.length>0){
          res.status(400).send('this email address was used')
        }
        else{
          // generate a salt for the user password, store the hash in user database
          var salt = Math.random.toString()
          var hash = md5(password+salt)
          new User({username: username, hash: hash,salt: salt}).save()
          new Profile({username:username,status:defaultstatus,following:[],email:email,zipcode:zipcode,picture:defaultpic}).save()
          res.send({username:username,email:email,status:defaultstatus})
        }
      })
    }
  })
}
/*change the password for the loggedIn user, a new salt wiil be generated for the new password*/
function changePassword(req,res){
  var username = req.username
  var newpassword = req.body.password
  var salt = Math.random.toString()
  var hash = getHash(newpassword,salt)
  User.find({username:username}).exec(function(err,items){
    if (items.length == 0){
        res.status(400).send('This user is not in my database')
    }
    items[0].salt = salt
    items[0].hash = hash
    items[0].save() // update the User table with new salt and hash
    res.send({username:username,status:'password changed'})
  })
}

//log in function
function login(req,res){
  var currentsid = req.cookies[cookieKey]
  //console.log('!!!!!!!!!!!!!!! '+currentsid)
    var username = req.body.username
    var password = req.body.password
    if (!username || !password){// need username and password to log in
      res.sendStatus(400)
      return
    }

    User.find({username:username}).exec(function(err,items){

      if (items.length == 0){// exception that avoid log in not exist user.
          res.status(400)
          return
        }

      if (currentsid){// log in second time to link account

        redis.get(currentsid, function(err, user) {
          if (user){ // user is the username of the current loggedIn user
            if (user == username){
              res.status(401)
              return
            }
            else{
              User.find({username:user}).exec(function(err,items){
                if (items[0].auth != 'FB'){// user is not logged in with third party aka Facebook
                  res.send(401)
                  return
                }
                else{//link the accout here
                  req.logout()// log out the facebook account here so to clear cookies and other stuff
                  Profile.find({username:user}).exec(function(err,items){
                    var currentFollows = items[0].following
                    Profile.find({username:username}).exec(function(err,items){
                      var userFollows = items[0].following.concat(currentFollows)
                      //remove duplicate items in following list
                      var newFollowing = userFollows.filter(function(item, pos) {
                              return userFollows.indexOf(item) == pos;
                          })
                      items[0].following = newFollowing
                      items[0].auth = user
                      items[0].save()

                    })
                    //delete the current Facebook account (Profile model)
                    items[0].remove()
                  })
                  //delete the current Facebook account (User model)
                  items[0].remove()
                }

              })
            }
          }
          else{// if no such user in the map, return unauthorized error
            res.sendStatus(401)
            return
          }
        })
        console.log('log in second time to test link account '+currentsid)
      }

      var salt = items[0].salt
      var hash = md5(password+salt)
      if (hash == items[0].hash){// correct password create cookie
        res.cookie(cookieKey,generateCode(username),{maxAge:3600*1000,httpOnly:false})
        var msg = {username:username,result:'success Login'}
        res.send(msg)
        return
      }
      else{// incorrect password can't log in
        res.status(401).send('wrong password')
        return

      }

    })

}

/*log out function clear the remove current sessionId from the session map and
clear the cookies*/

function logout(req,res){
  req.logout()

  sessionUser = {}
  redis.set(req.cookies.sid, '') // clear the sid in redis

  res.clearCookie('sid', { path: '/' });// clear cookie
  res.send({msg:"OK"})
  console.log('finish log out for user: '+req.username)
  return
}

/*endpoint that deal with the third party auth*/
function profile(req,res){
  var currentsid = req.cookies[cookieKey]
  var email = req.user.emails[0].value
  if (currentsid){// loggedIn second time to link the account
    req.logout()
    redis.get(currentsid, function(err, user) {
      Profile.find({username:email}).exec(function(err,items){
        if (items.length <= 0){
          res.status(401)
        }
        console.log(items.length)
        var thirdFollowing = items[0].following
        Profile.find({username:user}).exec(function(err,items){
          var userFollowing = items[0].following.concat(thirdFollowing)
          var newFollowing = userFollowing.filter(function(item, pos) {
                  return userFollowing.indexOf(item) == pos;
              })
              items[0].following = newFollowing
              items[0].auth = email
              items[0].save()
        })
        items[0].remove()
      })
      User.find({username:email}).exec(function(err,items){
        if (items.length == 0){
          res.status(400)
        }
        items[0].remove()
      })
      res.cookie(cookieKey,generateCode(user),{maxAge:3600*1000,httpOnly:false})
      res.redirect('http://cl40hw8frontend.herokuapp.com/#/main')//redirect to the main page
    })
  }
  else{
    var linkflag = 0
    Profile.find().exec(function(err,items){
      items.forEach(function(item){

        if (item.auth == email){
          req.logout()
          res.cookie(cookieKey,generateCode(item.username),{maxAge:3600*1000,httpOnly:false})
          res.redirect('http://cl40hw8frontend.herokuapp.com/#/main')//redirect to the main page
          linkflag = 1

        }
      })
      if (linkflag == 0){
        var zipcode = ''// can't determine the zipcode, leave the user edit it later
        var defaultpic = 'http://thumb1.shutterstock.com/display_pic_with_logo/1938752/221171704/stock-vector-cartoon-illustration-of-a-worried-little-pig-221171704.jpg'
        var defaultstatus = 'working on web development'
        Profile.find({username:email}).exec(function(err,items){// find if the user is already exist.
          if (items.length == 0){ //new user create a new profile and user
            var auth = 'FB'
            var username = email
            new User({username: username, auth:auth}).save()//create a new user
            new Profile({username:username,status:defaultstatus,following:[],email:email,zipcode:zipcode,picture:defaultpic}).save()
            //generate a cookie for this third party user as if hes log in as password login
            res.cookie(cookieKey,generateCode(username),{maxAge:3600*1000,httpOnly:false})
            var msg = {username:username,result:'success with third party login'}

            res.redirect('http://cl40hw8frontend.herokuapp.com/#/main')//redirect to the main page

          }
          else {// user may use third party to log in for a second time
            var username = items[0].username
            res.cookie(cookieKey,generateCode(username),{maxAge:3600*1000,httpOnly:false})
            var msg = {username:username,result:'success login with third party again'}
            console.log(msg)

            res.redirect('http://cl40hw8frontend.herokuapp.com/#/main')// redirect to the main page
          }
        })
      }
    })
  }


}

function generateCode(username){// add the sessionid loggedin user pair to the map
  var sessionId = Date.now().toString()
  sessionUser[sessionId] = username
  redis.set(sessionId, username)
  //console.log('generate sessionId '+sessionId)
  return sessionId
}

function fail(req,res){
  res.send('fail')
}

exports.isLoggedIn = isLoggedIn // export the isLoggedIn function so that it can
                                // be access by other endpoints in other files
