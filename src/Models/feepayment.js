const mongoose=require('mongoose')
const validate=require('validator')

const feePaymentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    feeType:{
        type:String,
        validate:function(value){
            if(!['monthly','quartly','yearly'].includes(value)){
                throw new Error("You can pay only ['monthly','quartly','yearly']")
            }
        }      
    },
    feeAmount:{
        type:String,
        required:true
    },
    orderId:{
        type:String
    },
    status:{
        type:String
    },
    currency:{
        type:String
    },
    receipt:{
        type:String
    },
      notes:{
        firstName:{
            type:String,
        },
        lastName:{
            type:String
        },
        feeType:{
            type:String
        },
        email:{
            type:String
        },
        feeAmount:{
            type:Number
        }
    }
})

const feePaymentmodels=mongoose.model('Fees',feePaymentSchema)
module.exports=feePaymentmodels