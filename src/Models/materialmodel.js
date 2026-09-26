const mongoose=require('mongoose')
const materialSchema=new mongoose.Schema({
        subjectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Subject',
            required:true
        },
        title:{
            type:String,
            required:true
        },
        materialType:{
            type:String,
            enum:['notes','dpp','assignment','lectureVideo'],
            required:true
        },
        duedate:{
            type:String
        },
        resourseUrl:{
            type:String
        },
        description:{
            type:String
        }

})

const materialModels=mongoose.model('Material',materialSchema)
module.exports=materialModels