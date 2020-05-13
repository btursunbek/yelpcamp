var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user.js");

//INDEX ROUTE
router.get("/", function(req, res){
	res.render("landing");
});

//================================
//AUTH ROUTES

//show register form
router.get("/register", function(req, res){
	res.render("register", {page: "register"});
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	var password = req.body.password;
	User.register(newUser, password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});


//show login form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
})

//handling login logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {	successRedirect: "/campgrounds",
													failureRedirect: "/login"
												  }), function(req, res){
});

//logout route
router.get("/logout", function (req, res){
	req.logout();
	res.redirect("/campgrounds");
})

module.exports = router;