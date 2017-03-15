var isLoggedIn = require('./auth.js').isLoggedIn
var uploadImage = require('../uploadCloudinary.js').uploadImage
var Profile = require('./model.js').Profile
var Post = require('./model.js').Post
var Comment = require('./model.js').Comment
var cookieParser = require('cookie-parser')

var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')

exports.setup = function(app) {
     app.use(cookieParser());
     app.get('/posts/:id*?',isLoggedIn,getPosts)
     app.post('/post',isLoggedIn,uploadImage,addPosts)
     app.put('/posts/:id',isLoggedIn,editPost)
}

/*get all the posts for the logged in user*/
function getPosts(req,res){
  var id = req.params.id
  var username = req.username
  var posts = []
  var following = []
  Profile.find({username:username}).exec(function(err, items) {
    following = items[0].following// find the list of following for the loggedIn user

    following.push(username)//also include LoggedIn user in our list of people
                            //from whom we want to get the feeds
    if (!id){//if we are not looking for a specific post
      //find the most 10 recent posts
      Post.find({author:{$in:following}}).limit(10).sort({date:-1}).exec(function(err, items) {
        items.forEach(function(item) {
        posts.push(item)
        })
        res.send({posts:posts})
          })
    }
    else{// finding the post with the id
    Post.find({id:id}).exec(function(err,items){
      posts.push(items[0])
      res.send({posts:posts})
    })
    }
      })
}
/*edit the post or add a comment or edit a comment*/
function editPost(req,res){
  var username = req.username
  var id = req.params.id
  var body = req.body.body
  var commentId = req.body.commentId
  if (!commentId){//edit a post body
    Post.find({id:id}).exec(function(err,items){
      if (items[0].author != username){//cant edit other's post
        res.sendStatus(403)
      }
      else{
        items[0].body = body
        items[0].save()
        res.send({posts:[items[0]]})
      }
    })
  }
  else{
    if (commentId == -1){// add a new comment to the new post
      Comment.find().exec(function(err,items){// add this new comment to the comment database
        var newcommentId = items.length+1
        var date = new Date().getTime()
        var comment = {commentId: newcommentId, author: username, date: date, body: body}
        new Comment({commentId: newcommentId, author: username, date: date, body: body}).save()
        Post.find({id:id}).exec(function(err,items){
          items[0].comments.push(comment)
          items[0].save()
          res.send({posts:[items[0]]})
        })

      })
    }
    else{//edit a comment
      Comment.find({commentId:commentId}).exec(function(err,items){
        if (items[0].author != username){
          res.sendStatus(403)
        }
        else{
          items[0].body = body
          items[0].save()
          var newComment = items[0]
          Post.find({id:id}).exec(function(err,items){
            var comments = items[0].comments
            var i = getCommentIndex(comments,commentId)
            if (i != -1){
              comments.splice(i,1)
              comments.push(newComment)
              items[0].comments = comments
              items[0].save()
            }

            res.send({posts:[items[0]]})
          })
        }
      })
    }
  }
}
/*This is a helper function that look through the comments field in the Post database
and find the index of the specific comment with the commentId so that we can make
changes to the comments in the post, return -1 if comment is not in the comment list
of this post*/
function getCommentIndex(comments,commentId){
  var i
  for (i=0;i<comments.length;i++){
    if (comments[i].commentId == commentId){
      return i
    }
    else {
      return -1
    }
  }
}
/*add a new post to the database*/
function addPosts(req, res){
    var uploadStream = cloudinary.uploader.upload_stream(function(result) {
    var username = req.username
    var body = req.body.body
    Post.find().exec(function(err,items){
    var id = items.length+1
    var date = new Date().getTime()
    var comments = []
    var img = result.url
    var newPost = {author:username,
                    body:body,
                    id:id,
                    date:date,
                    img:img,
                    comments:comments}
      new Post(newPost).save(function(){
        res.send(newPost)
      })
    })
  })
  var s = new stream.PassThrough()
  s.end(req.file.buffer)
  s.pipe(uploadStream)
  s.on('end', uploadStream.end)

}
