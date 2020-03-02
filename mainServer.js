let express = require("express");
let path = require("path");
let mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");

//open connect

mongoose
	.connect("mongodb://localhost:27017/data", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("database is connected");
	})
	.catch(error => {
		console.log("ERROR IS : " + error);
	});
//import my controllers
let authControler = require("./controler/AuthControler");
let speakersControler = require("./controler/speakersControler");
let eventsControler = require("./controler/eventsControler");
//open server by defult import
const mainServer = express();
//h5ly server bta3e listen bya5od mny (port num,callback fun)
mainServer.listen(8083, () => {
	console.log("port num is sucsessfly opened");
});
mainServer.use(express.urlencoded({ extended: false }));
// set the view engine to ejs
mainServer.set("view engine", "ejs");
mainServer.set(path.join(__dirname, "views"));
mainServer.use(express.static(__dirname + "/public"));
mainServer.use(express.static(__dirname + "/node_modules"));

mainServer.use(
	session({
		genid: req => {
			console.log("Inside the session middleware");
			console.log("req.sessionID : " + req.sessionID);
			return uuidv4(); // use UUIDs for session IDs
		},
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	}),
);

//h3ml awl middleWare f awl layer 3lshan kol el requestes t3dy 3leha f eh2wl w tetb3ly el url w no3 el method
// h5ly el server bta3y u use fun bta5od 3bramiters el req elu gaylo ely shayel eh url w el Response ely hwa eh rd 3 el req da w next fun 3lshan b3d me y5ls yro7 e el layer rhe b3d kda
mainServer.use(function(Request, Response, next) {
	console.log("this is the middleWare");
	console.log(" URL : " + Request.url);
	console.log(" kind of method : " + Request.method);
	console.log(Request.sessionID);

	next();
});
mainServer.get("/homePage", function(Request, Response) {
	const uniqueId = uuid();
	//res.send(`Hit home page. Received the unique id: ${uniqueId}\n`)
	Response.render("auth/login");
});
mainServer.use(authControler);
mainServer.get("/logout", function(Request, Response) {
	Request.session.destroy();
	console.log("cannot access session here");
	Response.redirect("/login");
});
mainServer.use(function(Request, Response, next) {
	console.log("this is the middleWare");
	if (Request.session) {
		next();
	} else {
		Response.render("auth/login");
	}
});

mainServer.use("/speakers", speakersControler);
mainServer.use("/events", eventsControler);

mainServer.use((Request, Response) => {
	Response.send("this is the defult controler !!!! ");
});
