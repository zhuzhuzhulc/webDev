/*
 * Test suite for posts.js
 */
var request = require('request')
var post = require('./post.js')

function url(path) {
	return "http://localhost:3000" + path
}

describe('Validate Post Functionality', function() {

	it('should give me three or more posts', function(done) {
		request(url("/posts"),function (err,res,body){
			expect(res.statusCode).toBe(200);
			//console.log(JSON.parse(body).posts)
			expect(JSON.parse(body).posts.length).toBe(3)
			//expect(1).toBe(2)
			done()
		})
 	}, 2000)
	/*

	it('should return a post with a specified id', function(done) {
		// call GET /posts first to find an id, perhaps one at random
		// then call GET /posts/id with the chosen id
		// validate that only one post is returned
		//expect(1).toBe(2)
		request(url("/posts/2"),function (err,res,body){
			var body = JSON.parse(response.body)

			expect(response.statusCode).toBe(200)
			expect(body.id).toBe(2)
			//expect(1).toBe(2)
			done()
		})
	}, 200)
*/
it('should give me a specific post', function(done) {
	request(url("/posts/2"),function (err,res,body){
		expect(res.statusCode).toBe(200);
		//console.log(JSON.parse(body).post.id)

		expect(JSON.parse(body).posts.id).toBe(2)
		//expect(1).toBe(2)
		done()
	})
}, 200)
/*
it('should give me nothing for a invalid id', function(done) {
	request(url("/posts/100"),function (err,res,body){
		expect(res.statusCode).toBe(200);
	//	console.log("ssssss")
		console.log(JSON.parse(body).post.id)
		//expect(JSON.parse(body).post.id).toBe(0)
		//expect(1).toBe(2)
		done()
	})
}, 200)
*/


it('should add a post and increment the post ID', function(done) {
	request({url:url("/posts"),
					method:"POST",
					json:{username:"cl40",body:"new post"}},function (err,res,body){
		expect(res.statusCode).toBe(200);
		expect(body.newPost.id).toBe(4)
		console.log(body)
		//console.(("!!!"+JSON.parse(body)))
		//expect(JSON.parse(body).post.id).toBe(2)
		done()
	})
}, 500)

it('should add a post and increment the post ID', function(done) {
	request({url:url("/posts"),
					method:"POST",
					json:{username:"cl40",body:"new post"}},function (err,res,body){
		expect(res.statusCode).toBe(200);
		expect(body.newPost.id).toBe(5)
		console.log(body)
		//console.(("!!!"+JSON.parse(body)))
		//expect(JSON.parse(body).post.id).toBe(2)
		done()
	})
}, 500)
});
 
describe('Profile Functionality', function() {

	it('should give me the status of the user', function(done) {
		request(url("/status"),function (err,res,body){
			expect(res.statusCode).toBe(200);
			expect(JSON.parse(body).status).toBe("My Status")
			//expect(1).toBe(2)
			done()
		})
 	}, 200)

	it('should change the user status', function(done) {
		request({url:url("/status"),
						method:"PUT",
						json:{user:"cl40",status:"new status"}},function (err,res,body){
			expect(res.statusCode).toBe(200);
			expect(body.status).toBe("new status")
			console.log(body)
			//console.(("!!!"+JSON.parse(body)))
			//expect(JSON.parse(body).post.id).toBe(2)
			done()
		})
	}, 500)

	it('should give me a status of another user', function(done) {
		request(url("/status/cl41"),function (err,res,body){
			expect(res.statusCode).toBe(200);
			//console.log(JSON.parse(body).post.id)

			expect(JSON.parse(body).status).toBe("I am cl41")
			//expect(1).toBe(2)
			done()
		})
	}, 1000)

 });
