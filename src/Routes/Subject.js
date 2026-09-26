const express=require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const subjectModal = require('../Models/subject')
const subjectRoute=express.Router()

subjectRoute.post('/create-subject',UserDataAuth,async(req,res)=>{
    try {
        const {name,description}=req.body

        const issubject=await subjectModal.findOne({name:name})        

        if(issubject){
            return res.status(500).json({message:"This Subject Is Already Exist!"})
        }

        const subject= new subjectModal({
            name,description
        })

        const saveSubject=await subject.save()
        return res.status(200).json({message:"Subject Addedd Succesfully!",data:saveSubject})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
})

module.exports=subjectRoute
