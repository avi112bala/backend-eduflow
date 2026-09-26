const { required } = require('joi')
const mongoose=require('mongoose')

const studentLeavesSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    startDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Approved','Rejected']
    },
    reason:{
        type:String,
        required:true
    }
})

const studentsLeaveModel=mongoose.model('StudentLeave',studentLeavesSchema)
module.exports=studentsLeaveModel