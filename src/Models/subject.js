const mongoose=require('mongoose')

const subjectScema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true
    }
})

const subjectModal=mongoose.model('Subject',subjectScema)
module.exports=subjectModal