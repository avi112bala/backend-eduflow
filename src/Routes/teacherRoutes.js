const express = require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const teacherModels = require('../Models/teachermodel')
const teacherRoutes = express.Router()
const Users = require('../Models/authmodels')
const { sendWhatsAppMessage } = require('../utils/twillo')
const subjectModal = require('../Models/subject')

teacherRoutes.post('/teacher-markattandance/:id', UserDataAuth, async (req, res) => {
    try {
        const { status, date } = req.body
        const { id } = req.params
        const user = req.user

        if (user.role !== "teacher") {
            return res.status(400).json({ message: "This feature is only for teachers." })
        }

        const isExisting = await teacherModels.findOne({ user: id, date })

        if (isExisting) {
            if (status === isExisting.status) {
                return res.status(400).json({ message: `Attandance already marked as ${status} ` })
            }

            isExisting.status = status
            const attandance = await isExisting.save()
            if (status === "absent") {
                const template = {
                    name: "Testing",
                    language: { code: 'en_US' },
                    components: [
                        {
                            type: 'body',
                            parameters: params.map(p => ({ type: 'text', text: p })),
                        },
                    ],
                }
                const subject=await subjectModal.find(isExisting?.subjectId)
                 console.log(subject, "subject");
                if(subject){
                    subject.status=false
                }

                const allstudent = await Users.find({ role: "student" })

                for (const student of allstudent) {
                    await sendWhatsAppMessage(student.phoneNumber, template);
                }
            }
            return res.status(200).json({ message: "Attandance is Marked", data: attandance })
        }
        const attandancedata = new teacherModels({
            user: id,
            status, date
        })
        const savedattandance = await attandancedata.save()
        return res.status(200).json({
            message: "Attandance is Marked",
            data: savedattandance
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

teacherRoutes.post('/push-notification/:id',UserDataAuth,async(req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        if(user.role!=="admin"){
            return res.status(400).json({message:"This feature is only for admin"})
        }

        const teacher=await Users.findById(id)
        const teacheravilabilty=await teacherModels.findById({user:teacher._id})
         if (teacheravilabilty.status === "absent") {
            const allstudent = await Users.find({ role: "student" })
            const findsubject=await subjectModal.findById(teacheravilabilty.subjectId)
            console.log(findsubject, "findsubject");

            for (const student of allstudent) {
                await sendWhatsAppMessage(student.phoneNumber, `Your ${findsubject.name} class has been cancelled for today`);
            }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})

teacherRoutes.get('/class',UserDataAuth,async(req,res)=>{
    try {
        const allSubject=await subjectModal.find()
        if(allSubject){
            return res.status(200).json({message:"all subject",data:allSubject})
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})

module.exports = teacherRoutes