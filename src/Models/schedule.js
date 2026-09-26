const mongoose = require("mongoose");

const scheduleSchema=new mongoose.Schema({
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    },
    date:{
        type:String,
        required:true
    },
    topic:{
        type:String,
    },
    startTime:{
        type:String,
        required:true
    },
    room:{
        type:String
    },
    meetingLink:{
        type:String
    }
},{timestamps:true})

const scheduleModal=mongoose.model("schedule",scheduleSchema)
module.exports=scheduleModal 