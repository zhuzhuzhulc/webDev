// this is model.js the structure of my database
var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
	commentId: Number, author: String, date: Date, body: String
})
var postSchema = new mongoose.Schema({
	id: Number, author: String, img: String, date: Date, body: String,
	comments: [ commentSchema ]
})

var UserSchema = new mongoose.Schema({
	username: String, hash: String,salt: String, auth:String
})
var profileSchema = new mongoose.Schema({
	username:String,status:String,following:[String],email:String,zipcode:String,picture:String,auth:String
})

exports.Post = mongoose.model('post', postSchema)
exports.User = mongoose.model('user', UserSchema)
exports.Comment = mongoose.model('comment',commentSchema)
exports.Profile = mongoose.model('profile', profileSchema)
