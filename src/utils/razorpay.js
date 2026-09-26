const Razorpay=require('razorpay')
require('dotenv')

var instance=new Razorpay({
    key_id:process.env.RAZOR_PAY_KEY,
    key_secret:process.env.RAZOR_PAY_SCREATE_KEY
})

module.exports=instance