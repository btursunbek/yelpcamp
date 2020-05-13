var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	Campground = require("./models/campground.js"),
	Comment = require("./models/comment.js"),
	User = require('./models/user.js'),
	seedDB = require("./seeds.js");

//requiring routes
var commentsRoutes = require("./routes/comments.js"),
	campgroundRoutes = require("./routes/campgrounds.js"),
	indexRoutes = require("./routes/index.js");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/travel", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//seedDB(); //seeding with data

//PASSPORT Configuration
app.use(require("express-session")({
	secret: "HelloWorld!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
});

	
//route files
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("Server started..")
});