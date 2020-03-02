const express = require("express");
const authControler = express.Router();
var login = require("path");
var bodyParser = require("body-parser");
let mongoose = require("mongoose");
require("../models/speakersModel");

let speakerMongoose = mongoose.model("speakers");

//login get
authControler.get("/login", (request, Response) => {
	Response.render("auth/login.ejs");
});
//login post
authControler.post("/login", (request, Response) => {
	console.log(request.body);
	speakerMongoose
		.find({ _email: request.body.username, _Password: request.body.password })
		.then(data => {
			console.log(data);
			if (data[0]) {
				if (
					request.body.username == "admin@gmail.com" &&
					request.body.password == "131"
				) {
                    request.session.role = "admin";
                    
					//console.log(data);
					request.session.role = "admin";
					request.session.data = data[0];
					console.log(request.session);

					Response.redirect("speakers/list");
				} else {
					request.session.role = "user";
					request.session.data = data[0];
					console.log(request.session);
					Response.redirect("/profile");
				}
			} else {
				Response.render("auth/login");
			}
		});

	//Response.send("you should log in firest");
});

//register , get
authControler.get("/register", (request, Response) => {
	Response.render("auth/register");
});

//register post
authControler.post("/register", (request, Response) => {
	console.log(request.body);

	addSpeakerMongoose = new speakerMongoose({
		//_id: request.body.id,
		_name: request.body.name,
		_age: request.body.age,
		_UserName: request.body.UserName,
		_email: request.body.email,
		_Password: request.body.Password,
		"_Address._city": request.body.city,
		"_Address._street": request.body.street,
		"_Address._building": request.body.building,
	});
	addSpeakerMongoose
		.save()
		.then(data => {
             
            console.log(data);
            request.session.role = "user";
            request.session.data = data;
            console.log(" >>>>>>>>>>>>"+request.session.data);
            Response.redirect("/events/list");		
        } )
		.catch(error => {
			console.log("error : " + error);
		});
});

authControler.use(function(Request, Response, next) {
	console.log("this is the session.role middleWare");

	if (Request.session.role == "admin" || Request.session.role == "user") {
		console.log(Request.session.role);

		next();
	} else {
		Response.redirect("/login");
	}
});
authControler.get("/profile", (request, response) => {
    data=request.session.data;
    response.render("auth/profile.ejs", {data:data});
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<,",data)


	console.log("Dataaaaa");
	// console.log(data);
});
module.exports = authControler;
