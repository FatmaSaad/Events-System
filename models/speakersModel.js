var mongoose = require('mongoose');
 

var autoIncrement = require("mongoose-sequence")(mongoose);

speakerSchema=new mongoose.Schema({
    _id:Number,
    _age:Number,
    _name:String,
    _email:String,
    _UserName:String,
    _Password:String,
    _Address:{
        _city:String,
        _street:String,
        _building:Number
    }
}, {_id: false});
//mapping
speakerSchema.plugin(autoIncrement);
mongoose.model("speakers",speakerSchema);

