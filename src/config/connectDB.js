const mongoose=require('mongoose')
require('dotenv')

const connectDB=async()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STR)
}

module.exports=connectDB