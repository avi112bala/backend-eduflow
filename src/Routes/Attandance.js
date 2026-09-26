const express = require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const attandanceRoute = express.Router()
const attandanceModal = require('../Models/attendance')
const mongoose = require('mongoose')

attandanceRoute.post('/markattandance/:id', UserDataAuth, async (req, res) => {
    try {
        const { subjectID, status, date } = req.body
        const { id } = req.params
        const user = req.user
        if (user?.role !== "teacher") {
            return res.status(400).json({
                message: `Attandance only marked by teacher`,
            })
        }

        const isExisting = await attandanceModal.findOne({ user: id, subjectID, date })

        if (isExisting) {
            if (isExisting.status === status&&isExisting.date === date) {
                return res.status(200).json({
                    message: `Attandance already marked as ${status}.`,
                    data: isExisting
                })
            }

            isExisting.status = status
            await isExisting.save()

            return res.status(200).json({
                message: `Attandance marked as ${status}`,
                data: isExisting
            })
        }

        const saveattandance = new attandanceModal({
            user: id,
            subjectID,
            status,
            date
        })
        const savedattandance = await saveattandance.save()
        return res.status(200).json({ message: "Mark attandance", data: savedattandance })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

attandanceRoute.get('/gettotalattandance/:id', UserDataAuth, async (req, res) => {
    try {
        const { id } = req.params
        const userAttandance = await attandanceModal.find({ user: id })
        const totalattandance = 30
        const studentAttandance = userAttandance?.length
        const studentPercentage = (studentAttandance / totalattandance) * 100

        return res.status(200).json({
            message: "all attandance",
            data: studentPercentage.toFixed(2)
        })


    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
})

attandanceRoute.get('/getsubjectattandance/:id', UserDataAuth, async (req, res) => {
    try {
        const { id } = req.params

        const subjectWiseAttendance = await attandanceModal.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(id) }
            },
            {
                $group: {
                    _id: "$subjectID",
                    totalClasses: { $sum: 1 },
                    presentCount: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
                    },
                    absentCount: {
                        $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "_id",
                    foreignField: "_id",
                    as: "subjectInfo"
                }
            },
            {
                $unwind: { path: "$subjectInfo", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    subjectID: "$_id",
                    subjectName: "$subjectInfo.name", // adjust field name to match your Subject schema
                    totalClasses: 1,
                    presentCount: 1,
                    absentCount: 1,
                    percentage: {
                        $round: [
                            { $multiply: [{ $divide: ["$presentCount", "$totalClasses"] }, 100] },
                            2
                        ]
                    }
                }
            }
        ])

        return res.status(200).json({
            message: "subject-wise attendance",
            data: subjectWiseAttendance
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

attandanceRoute.get('/getstudentAttandance', UserDataAuth, async (req, res) => {
    try {
        const subjectWiseAttendance = await attandanceModal.aggregate([
            {
                $lookup: {
                    from: 'users', // the actual MongoDB collection name (check it's plural/lowercase)
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            { $match: { 'userDetails.role': 'student' } }
        ])

        return res.status(200).json({
            message: "all student attendance",
            data: subjectWiseAttendance
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

module.exports = attandanceRoute