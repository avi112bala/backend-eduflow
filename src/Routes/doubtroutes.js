const express = require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const validate = require('../middleware/Validate')
const { doubtschemavalidator } = require('../validator/doubtvalidator')
const doubtModel = require('../Models/doubtmodels')
const subjectModal = require('../Models/subject')
const doubtRoute = express.Router()

doubtRoute.post('/create-boubt', UserDataAuth, validate(doubtschemavalidator), async (req, res) => {
    try {
        const { subjectId, userId, title, doubt, media, doubtType } = req.body

        const data = {
            subjectId, userId, title, doubt, media, doubtType
        }
        const result = new doubtModel(data)
        const savedresult = await result.save()
        if (savedresult) {
            return res.status(200).json({ message: "Generated Doubt!" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

doubtRoute.get('/getalldoubt', UserDataAuth, async (req, res) => {
    try {
        const { role } = req.user
        if (role === "student") {
            const { status } = req.query
            const { _id } = req.user

            const filter = { userId: _id }

            if (status) {

                const allowed = ['pending', 'resolved']
                if (!allowed.includes(status)) {
                    return res.status(400).json({ message: `Invalid status. Allowed values: ${allowed.join(', ')}` })

                }
                filter.status = status
            }
            const doubts = await doubtModel.find(filter)
            return res.status(200).json({
                message: "all doubts",
                data: doubts
            })
        } else if (role === "teacher") {
            const { status } = req.query
            const { subjectId } = req.user

            const filter = { subjectId: subjectId }

            if (status) {

                const allowed = ['pending', 'resolved']
                if (!allowed.includes(status)) {
                    return res.status(400).json({ message: `Invalid status. Allowed values: ${allowed.join(', ')}` })

                }
                filter.status = status
            }
            const doubts = await doubtModel.find(filter)
            return res.status(200).json({
                message: "all doubts",
                data: doubts
            })
        }


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

doubtRoute.put('/relove-doubt/:id',UserDataAuth,async(req,res)=>{
     try {
        const { id } = req.params
        const { _id } = req.user
        const {explaination}=req.body

        const get = await doubtModel.find({
            _id: id,
            userId: _id
        })

        if (!get) {
            return res.status(404).json({ message: "Doubt not found" })
        }

      await doubtModel.findByIdAndUpdate(id,{
            explaination:explaination,
            doubtType:"resolved"
        })


        return res.status(200).json({
            message: "doubt updated successfully",
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


doubtRoute.delete('/deletedoubt/:id', UserDataAuth, async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user

        const deletedDoubt = await doubtModel.findOneAndDelete({
            _id: id,
            userId: _id
        })

        if (!deletedDoubt) {
            return res.status(404).json({ message: "Doubt not found or you don't have permission to delete it" })
        }

        return res.status(200).json({
            message: "doubt deleted successfully",
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = doubtRoute