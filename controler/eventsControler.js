let express = require("express");
let mongoose = require("mongoose");

let eventsControler = express.Router();

require("../models/eventsModel");

let eventsMongoose = mongoose.model("events");

require("../models/speakersModel");
let speakerMongoose = mongoose.model("speakers"); // list get

eventsControler.get("/list", function(request, response) {
	eventsMongoose
		.find({})
		.populate({ path: "_mainSpeaker _otherSpeakers " })
		.then(data => {
			console.log(data);
			let role = request.session.role;
			console.log(role);
			response.render("events/EventsList.ejs", { data, role });
		})

		.catch(error => {
			console.log("error : " + error);
		});
});

eventsControler.use(function(Request, Response, next) {
	console.log("this is the session.role middleWare");

	if (Request.session.role == "admin") {
		console.log(Request.session.role);

		next();
	} else {
		Response.redirect("/login");
	}
});
let speakers;
eventsControler.get("/add", function(request, response) {
	speakerMongoose
		.find({})
		.then(speakerData => {
			// response.send(speakerData);
			response.render("events/add", { speakerData: speakerData });
			speakers = speakerData;
			//console.log(speakers);
		})
		.catch(error => {
			console.log("error : " + error);
		});
});

eventsControler.post("/add", function(request, response) {
	console.log(request.body);
	addEventsMongoos = new eventsMongoose({
		_id: request.body.id,
		_name: request.body.name,
		_title: request.body.title,
		_eventDate: request.body.eventDate,
		_mainSpeaker: request.body.mainSpeaker,
		_otherSpeakers: request.body.OtherSpeakers,
	});
	addEventsMongoos
		.save()
		.then(data => {
			console.log(data);
			response.redirect("list");
		})
		.catch(error => {
			console.log("error : " + error);
		});
});
eventsControler.get("/edit/:id", function(request, response) {
	eventsMongoose
		.find({ _id: request.params.id })
		.populate({ path: "mainSpeaker otherSpeaker" })
		.then(data => {
			console.log("data" + data[0]);
			let event = data[0];
			speakerMongoose.find({}, { _id: 1, _name: 1 }).then(speakerData => {
				console.log("speakerData" + speakerData);

				response.render("events/edit.ejs", { event, speakerData });
				console.log("event : " + event);
				console.log("speakerData : " + speakerData);
			});
		})
		.catch(error => {
			console.log("error : " + error);
		})
		.catch(error => {
			console.log("error : " + error);
		});
});

eventsControler.post("/update", function(request, response) {
	eventsMongoose
		.updateOne(
			{ _id: request.body.id },
			{
				$set: {
					_name: request.body.name,
					_title: request.body.title,
					_eventDate: request.body.eventDate,
					_mainSpeaker: request.body.mainSpeaker,
					_otherSpeakers: request.body.OtherSpeakers,
				},
			},
		)
		.then(data => {
			console.log("data  :::  " + data);

			response.redirect("list");
		})
		.catch(error => {
			console.log("error : " + error);
		});
});

eventsControler.get("/delete/:id", function(request, response) {
	eventsMongoose
		.deleteOne({ _id: request.params.id })
		.then(data => {
			response.send(data);
		})
		.catch(error => {
			console.log("error : " + error);
		});
});
module.exports = eventsControler;
