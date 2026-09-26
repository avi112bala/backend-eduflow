const express = require('express')
const { UserDataAuth } = require('../middleware/UserAuthData')
const scheduleModal = require('../Models/schedule')
const scheduleRouter = express.Router()

scheduleRouter.post('/scheduleClass', UserDataAuth, async (req, res) => {
    try {
        const { role } = req.user
        const { subjectId, date, topic, startTime, room, meetingLink } = req.body
        if (role !== "teacher") {
            res.status(400).json({ message: "Only Teacher can schedule the class" })
        }

        const data = {
            subjectId,
            date,
            topic,
            startTime,
            room,
            meetingLink
        }
        const scheduleData = new scheduleModal(data)
        const result = await scheduleData.save()

        const resultData = await scheduleModal.findById(result._id).populate("subjectId")
        if (resultData) {
           return res.status(200).json({ message: "Class Scheduled!", data: resultData })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
scheduleRouter.get('/getscheduleclass', UserDataAuth, async (req, res) => {
    try {
        const now = new Date();

        // Start of today
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        // End of today
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Convert Date → epoch seconds → String
        const startTimestamp = Math.floor(startOfDay.getTime() / 1000).toString();
        const endTimestamp = Math.floor(endOfDay.getTime() / 1000).toString();

        const allScheduleClass = await scheduleModal
            .find({
                date: {
                    $gte: startTimestamp,
                    $lte: endTimestamp
                }
            })
            .populate("subjectId");

        return res.status(200).json({
            message: "All classes",
            data: allScheduleClass
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
scheduleRouter.delete('/deleteschedule/:id',UserDataAuth,async(req,res)=>{
    try {
        const {role}=req.user
        const {id}=req.params
        if(role!=="teacher"){
            return res.status(401).json({message:"Only teachers have this access."})
        }
        const deleteschedule=await scheduleModal.findByIdAndDelete(id)
        if(deleteschedule){
            return res.status(200).json({message:"Schedule Class Deleted Successfully!"})
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

module.exports = scheduleRouter