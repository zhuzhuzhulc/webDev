var isLoggedIn = require('./auth.js').isLoggedIn
var Profile = require('./model.js').Profile
var cookieParser = require('cookie-parser')

exports.setup = function(app) {
    app.use(cookieParser());
    app.put('/following/:user',isLoggedIn,addFollowing)

    app.get('/following/:users?',isLoggedIn,getFollowing)
    app.delete('/following/:user',isLoggedIn,deleteFollowing)
  }
  /*get the following user from database*/
  function getFollowing(req,res){
    var username = req.username
    if (req.params.user!=null){// if there is a specific user other than loggedIn username
                              // as input payload, get the following for this user
      username = req.params.user
    }
    var following = []
    Profile.find({username:username}).exec(function(err, items) {
      console.log('in following '+username)
      if (items.length==0){// user not exist
        res.status(400)
      }
      following = items[0].following
      res.send({username:username,following:following})
    })
  }
  /*add a new following for loggedIn user*/
  function addFollowing(req,res){
    var username = req.username
    var newfollowing = req.params.user
    var following = []
    Profile.find({username:newfollowing}).exec(function(err, items) {
      //check if the user exist
      if (items.length<=0){// user not exist
        res.status(400).send('This user is not in my database')
      }
      else {// add the user to the following
        Profile.find({username:username}).exec(function(err,items){
          if (items[0].following.indexOf(newfollowing)==-1){// user not in following list
            items[0].following.push(newfollowing)
            items[0].save()
            following = items[0].following
            res.send({username:username,following:following})
          }
          else {// this input user is already in the following list
            res.sendStatus(400)
          }
        })
      }
    })
  }
  /*delete the user from the following list*/
  function deleteFollowing(req,res){
    var deleteuser = req.params.user
    var username = req.username
    Profile.find({username:username}).exec(function(err, items) {
      var array = items[0].following
      var i = array.indexOf(deleteuser)
      if (i!=-1){
        array.splice(i,1)
      }
      items[0].following = array
      items[0].save()
      res.send({username:username,following:array})
    })

  }
