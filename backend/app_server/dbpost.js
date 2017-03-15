// this is dbpost.js
var Post = require('./model.js').Post
var Profile = require('./model.js').Profile
var Comment = require('./model.js').Comment

exports.setup = function(app) {
     app.get('/find/:user', find)
}

function find(req, res) {
     findByAuthor(req.params.user, function(items) {
          res.send({items: items})
     })
}

//////////////////////////////
// remove these examples

function findByAuthor(author, callback) {
	Post.find({ author: author }).exec(function(err, items) {
		console.log('There are ' + items.length + ' entries for ' + author)
		var totalLength = 0
		items.forEach(function(post) {
			totalLength += post.body.length
		})
		console.log('average length', totalLength / items.length)
		callback(items)
	})
}

Post.remove().exec(function(err, items) {//clear the posts table so that, be careful
    console.log("There are " + items.length + " posts total in db")
     })

Comment.remove().exec(function(err, items) {//clear the posts table so that, be careful
   console.log("There are " + items.length + " Comments total in db")
    })

new Post({ id: 1, author: 'qq', img: null, date: new Date().getTime(), body: 'This is qq first post', comments: []}).save()
new Post({ id: 2, author: 'ww', img: null, date: new Date().getTime(), body: 'This is ww second post', comments: []}).save()
new Post({ id: 3, author: 'ee', img: null, date: new Date().getTime(), body: 'This is ee third post', comments: []}).save()
new Post({ id: 4, author: 'qq', img: null, date: new Date().getTime(), body: 'This is qq forth post', comments: []}).save()
new Post({ id: 5, author: 'ww', img: null, date: new Date().getTime(), body: 'This is ww fifth post', comments: []}).save()
new Post({ id: 6, author: 'ee', img: null, date: new Date().getTime(), body: "This is ee's post"}).save(function() {
     console.log('done with save')
     Post.find().exec(function(err, items) {
          console.log("There are " + items.length + " posts total in db")
          console.log(items[0])
          findByAuthor('sep1', function() {
              findByAuthor('jmg3', function() {
                  console.log('complete')
                  process.exit()
              })
          })
     })
/*
      Post.remove().exec(function(err, items) {//clear the posts table so that, be careful
          console.log("There are " + items.length + " posts total in db")
           })
           */

})

//////////////////////////////
