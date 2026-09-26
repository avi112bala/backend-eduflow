const mongoose = require('mongoose')
const validate = require('validator')

const attandanceScema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subjectID: {
        type: String,
        required: true
    },
    status: {
        type: String,
        require: true,
        validate: function (value) {
            if (!['present', 'absent'].includes(value)) {
                throw new Error("status must be one of these [present,absent]")
            }
        }
    },
    date: {
        type: String,
        required: true
    },
})
attandanceScema.index({ user: 1, subjectID: 1, date: 1 }, { unique: true })
const attandanceModal = mongoose.model('Attandance', attandanceScema)
module.exports = attandanceModal