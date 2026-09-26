const express = require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const validate = require('../middleware/Validate')
const { materialvalidateSchema } = require('../validator/materialvalidator')
const materialModels = require('../Models/materialmodel')
const materialRoutes = express.Router()


materialRoutes.post('/creatematerial', UserDataAuth, validate(materialvalidateSchema), async (req, res) => {
    try {
        const { role } = req.user
        if (role !== "teacher") {
           return res.status(401).json({ message: "Only Teachers can upload materials" })
        }

        const { subjectId, title, materialType, duedate, resourseUrl, description } = req.body
        const data = {
            subjectId, title, materialType, duedate, resourseUrl, description
        }

        const result = new materialModels(data)
        const savedresult=await result.save()

        const findsavedresult=await materialModels.findById(savedresult?._id).populate("subjectId")
        if(findsavedresult){
            return res.status(200).json({
                message:"Material Upload Successfully",
                data:findsavedresult
            })
        }


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

materialRoutes.get('/getmaterials',UserDataAuth,validate(materialvalidateSchema),async(req,res)=>{
      try {

        const getallmetrial=await materialModels.find()

        if(getallmetrial){
            return res.status(200).json({
                message:"Material fetched successfully",
                data:getallmetrial
            })
        }


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

materialRoutes.delete('/deletematerial/:id',UserDataAuth,validate(materialvalidateSchema),async(req,res)=>{
      try {
        const { role } = req.user
        const {id}=req.params
        if (role !== "teacher") {
           return res.status(401).json({ message: "Only Teachers can upload materials" })
        }

        const deleteMAterial=await materialModels.findByIdAndDelete(id)

        if(deleteMAterial){
            return res.status(200).json({
                message:"Material deleted successfully",
            })
        }


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports=materialRoutes