const mongoose = require('mongoose')
const validate = require('validator')

const parentSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    }
})

const authScema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    feeStatus:{
        type:Boolean
    },
    profilPic: {
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7UvRFDtLOE-f7C6l_RIIloM4HUZz5bf4iDlifbSqkw&s=10"
    },
    address: {
        type: String
    },
    password: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    newpassword: {
        type: String,
        require: true
    },
    subjectId: {
        type: String,
    },
    parentInfo: parentSchema,
    role: {
        type: String,
        validate: function (value) {
            if (!['student', 'teacher', 'parent', 'admin'].includes(value)) {
                throw new Error("Role is not correct!")
            }
        }
    }
})

const authMoadal = mongoose.model('User', authScema)

module.exports = authMoadal