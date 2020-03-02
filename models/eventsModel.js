mongoose=require("mongoose");
eventsSchema=new mongoose.Schema({
    _id:Number,
    _name:String,
    _title:String,
    _eventDate:Date,
    _mainSpeaker:{type:Number,ref:"speakers"},
    _otherSpeakers:[{type:Number,ref:"speakers"}],


});
//mapping
mongoose.model("events",eventsSchema);