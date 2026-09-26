const { required } = require('joi')
const mongoose=require('mongoose')

const doubtSchema=new mongoose.Schema({
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    doubt:{
        type:String,
        required:true
    },
    doubtType:{
        type:String,
        enum:['pending','resolved'],
        default:'pending'
    },
    media:{
        type:String,
    },
    explaination:{
        type:String
    }
})

const doubtModel=mongoose.model('Doubt',doubtSchema)
module.exports=doubtModel