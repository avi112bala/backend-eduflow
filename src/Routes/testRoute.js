const express=require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const testmodal = require('../Models/testModal')

const testRoutes=express.Router()

testRoutes.post('/create-test',UserDataAuth,async(req,res)=>{
    try {
        const {SubjectId,date,testDuration,testName,testtype,totalmarks}=req.body

        const user=req.user
        if(user?.role!="teacher"){
            return res.status(400).json({message:"Test will be created by only Teacher"})
        }
        const test=new testmodal({
            SubjectId,date,testDuration,testName,testtype,totalmarks
        })
        const savedTest=await test.save()
        return res.status(200).json({message:"Test created successfully!",data:savedTest})

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})

testRoutes.get('/get-tests',UserDataAuth,async(req,res)=>{
    try {
       const alltest=await testmodal.find()
        return res.status(200).json({message:"all tests!",data:alltest})

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})

module.exports=testRoutes