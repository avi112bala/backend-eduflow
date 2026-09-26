const mongoose = require('mongoose')
const validate = require('validator')
const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        validate: function (value) {
            if (!['present', 'absent'].includes(value)) {
                throw new Error("Please select any of the method [present,absent]")
            }
        }
    },
    date: {
        type: String,
    }
})

const teacherModels = mongoose.model('Teacher', teacherSchema)
module.exports = teacherModels