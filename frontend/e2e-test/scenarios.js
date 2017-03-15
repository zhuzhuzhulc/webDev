describe('Front end e2e test', function() {
	'use strict'
	var baseUrl = 'http://localhost:3000/index.html#/'
	beforeEach(function() {
		browser.get('/index.html')
	})

	it('should register a new user', function() {
		register()
	})

	function register(){
		element(by.id('newname')).sendKeys('testname')
		element(by.id('newemail')).sendKeys('testname@gmail.com')
		element(by.id('newphone')).sendKeys('111-222-3333')
		element(by.id('newzipcode')).sendKeys('77005')
		element(by.id('newpwd')).sendKeys('abc')
		element(by.id('newpwdconfirm')).sendKeys('abc')
		element(by.id('registerbtn')).click()
		expect(element(by.id('registerMsg')).getText()).toMatch('register new user')

	}

	function login() {

		element(by.id('loginName')).sendKeys('cl40test')
		element(by.id('loginPwd')).sendKeys('fort-highest-ourselves')
		element(by.id('loginbtn')).click()
		expect(browser.getCurrentUrl()).toEqual(baseUrl + 'main')
	}

	function logout() {
		element(by.id('logoutbtn')).click()
		expect(browser.getCurrentUrl()).toEqual(baseUrl)
	}

	it('should log in as my test user and validate my status message', function() {
		login()
		// validate your username and status message
		logout()
	})

	function setStatus(value) {
		element(by.id('statusinput')).clear()
		element(by.id('statusinput')).sendKeys(value)
		element(by.id('statusbtn')).click()

	}

	it('should update the status', function() {
		login()

		// validate the current status message in the <span>

		var newStatus = "A new status message"
		setStatus(newStatus)
		// validate the new status message in the <span>
		expect(element(by.id('status')).getText()).toMatch(newStatus)
		// revert back to the old status message
		// setStatus(status)
		// validate it is correctly reverted in the <span>

		logout()
	})

	it('should add a new post', function() {
		login()

		// validate the current status message in the <span>

		addpost()
		expect(element.all(by.id('postbody')).first().getText()).toMatch("test post")
		logout()
	})

	function addpost(){
		element(by.id('postinput')).clear()
		element(by.id('postinput')).sendKeys("test post")
		element(by.id('postbtn')).click()
	}

	it('should add a follower', function() {
		login()

		// validate the current status message in the <span>

		 element.all(by.id("following")).count().then(function (count){
			 addfollow()
			 expect(element.all(by.id("following")).count()).toBe(count+1)
		 })
		//console.log(numFollowing)
		logout()
	})
	function addfollow(){
		element(by.id('followinput')).clear()
		element(by.id('followinput')).sendKeys("Follower")
		element(by.id('followaddbtn')).click()
	}


	it('should update email', function() {
		login()
		element(by.id('profilebtn')).click()
		// validate the current status message in the <span>
		element(by.id('emailinput')).clear()
		element(by.id('emailinput')).sendKeys("test1@gmail.com")
		element(by.id('emailbtn')).click()
		expect(element(by.id('email')).getText()).toMatch("test1@gmail.com")

	})

	it('should update zipcode', function() {

		element(by.id('profilebtn')).click()
		// validate the current status message in the <span>
		element(by.id('zipcodeinput')).clear()
		element(by.id('zipcodeinput')).sendKeys("12345")
		element(by.id('zipcodebtn')).click()
		expect(element(by.id('zipcode')).getText()).toMatch("12345")

	})

	it('should update pwd, a message will return', function() {


		// validate the current status message in the <span>
		element(by.id('profilebtn')).click()
		element(by.id('pwdinput')).sendKeys("12345")
		element(by.id('pwdconfirminput')).sendKeys("12345")
		element(by.id('pwdbtn')).click()
		expect(element(by.id('pwdmsg')).getText()).toMatch('password changed')

	})

})
