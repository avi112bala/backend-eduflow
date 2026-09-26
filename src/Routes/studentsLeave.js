const express=require('express');
const { UserDataAuth } = require('../middleware/UserAuthData');
const validate = require('../middleware/Validate');
const { studentvalidateSchema } = require('../validator/studentsLeavesValidator');
const studentsLeaveModel = require('../Models/studentsLeaveModels');
const studentLeaveRouter=express.Router();

studentLeaveRouter.post('/request-leave',UserDataAuth,validate(studentvalidateSchema),async(req,res)=>{
    try {
        const {studentId,startDate,endDate,reason}=req.body

        const data={studentId,startDate,endDate,reason}
        const result=new studentsLeaveModel(data)
        const savedresult=await result.save()
        return res.status(200).json({
            message:"Request a leave successfully!",
            data:savedresult
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

studentLeaveRouter.get('/getallleaves/:id',UserDataAuth,async(req,res)=>{
    try {
        const {id}=req.params
        const findallLeaves=await studentsLeaveModel.find({
            studentId:id
        }).populate('studentId','-password')



        if(findallLeaves){
            return res.status(200).json({
                message:"Fetch all leaves",
                data:findallLeaves
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})

studentLeaveRouter.delete('/deleteleave/:id',UserDataAuth,async(req,res)=>{
    try {
        const {id}=req.params
        const findallLeaves=await studentsLeaveModel.findByIdAndDelete(id)
        if(findallLeaves){
            return res.status(200).json({
                message:"Unrequest Leave",
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
})


module.exports=studentLeaveRouter