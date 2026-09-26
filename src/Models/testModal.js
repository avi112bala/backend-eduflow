const mongoose=require('mongoose')

const testSchema=new mongoose.Schema({
    SubjectId:{
        type:String
    },
    date:{
        type:String
    },
    testDuration:{
        type:String
    },
    testName:{
        type:String
    },
    testtype:{
        type:String
    },
    totalmarks:{
        type:String
    }
})

const testmodal=mongoose.model('Test',testSchema)
module.exports=testmodal