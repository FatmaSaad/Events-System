const express=require("express");
let speakersControler=express.Router();
let mongoose=require("mongoose");
require("../models/speakersModel");
let speakerMongoose=mongoose.model("speakers");


speakersControler.get("/add",function(request,response){

    response.send("/speakers/add");

});


speakersControler.post("/add",function(request,response){
    addSpeakerMongoose=new speakerMongoose({

        //_id:autoIndex,
        _name:request.body.name,
        _age:request.body.age,
        _UserName:request.body.UserName,
        _Password:request.body.Password,
        "_Address._city":request.body.city,
        "_Address._street":request.body.street,
        "_Address._building":request.body.building,
   
    });
        addSpeakerMongoose.save()
        .then((data)=>{
            response.send(request.body);
        }).catch((error)=>{console.log("error : "+error)});
});

speakersControler.use(function(Request, Response, next) {
	console.log("this is the session.role middleWare");

	if (Request.session.role == "admin") {
		console.log(Request.session.role );

		next();
	} else {
		Response.redirect("/login");
	}
});
speakersControler.get("/edit/:id",function(request,response){
	speakerMongoose.find({_id:request.params.id})
    .then((data)=>{
		console.log(data[0]);
		response.render("speakers/edit.ejs",{data:data[0]});
    }).catch((error)=>{console.log("error : "+error)});
	
});

speakersControler.get("/list",function(request,response){

    speakerMongoose.find({})
        .then((data)=>{
           // response.send(data);
            response.render("speakers/speakerList.ejs",{data:data});
        }).catch((error)=>{console.log("error : "+error)});
});




speakersControler.post("/update",function(request,response){
    console.log("request.body.id :",request.body.id);

    speakerMongoose.updateOne({_id:request.body.id},{$set:{

        _name:request.body.name,
        _age:request.body.age,
        _UserName:request.body.UserName,
        _Password:request.body.Password,
        "_Address._city":request.body.city,
        "_Address._street":request.body.street,
        "_Address._building":request.body.building,
    }})

    .then((data)=>{
        console.log(request.body);
        response.redirect("list");
    }).catch((error)=>{console.log("error : "+error)});

});

speakersControler.get("/delete/:id",function(request,response){

    speakerMongoose.deleteOne({_id:request.params.id})
    .then((data)=>{
        response.send(data);
    }).catch((error)=>{console.log("error : "+error)});
});


// speakersControler.get("/add",function(request,response){

//     response.send("/speakers/add");

// });
module.exports=speakersControler;