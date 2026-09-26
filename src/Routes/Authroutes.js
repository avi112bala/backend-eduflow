const express = require('express')
const authRoute = express.Router()
const Users = require('../Models/authmodels')
const bycrpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserDataAuth } = require('../middleware/UserAuthData')

authRoute.post('/signup', async (req, res) => {
    try {
        const {
            email, password, role, subjectId, phoneNumber,
            parentInfo: {
                firstName: ParentfirstName,
                lastName: ParentlastName,
                email: Parentemail,
                phoneNumber: ParentphoneNumber
            } = {}
        } = req.body

        const isUser = await Users.findOne({ email })
        if (isUser) {
            return res.status(400).json({ message: `Email already in use by ${isUser.role}` })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required!" })

        }
        const hashedPassword = await bycrpt.hash(password, 10)

        const userData = { ...req.body, email, password: hashedPassword, role, phoneNumber }

        if (role === "teacher") {
            userData.subjectId = subjectId
        } else if (role === "student") {
            userData.parentInfo = {
                firstName: ParentfirstName,
                lastName: ParentlastName,
                email: Parentemail,
                phoneNumber: ParentphoneNumber
            }
        }
        // admin and parent roles: no extra fields needed

        const newUser = new Users(userData)
        const savedUser = await newUser.save()

        const token = jwt.sign(
            { userId: savedUser._id, email: savedUser.email, role: savedUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 3600000,
        })

        const { password: _, ...userResponse } = savedUser.toObject()

        return res.status(200).json({ message: "Signup Successfully!", data: userResponse })

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
})
authRoute.post('/signin', async (req, res) => {
    try {
        const { email, password, role } = req.body

        const isUser = await Users.findOne({ email: email })
        if (!isUser) {
            return res.status(401).json({ message: "User Not Found!" })
        }
        if (role != isUser?.role) {
            return res.status(500).json({ message: "Please choose correct role" })
        }
        const haspassworddecode = await bycrpt.compare(password, isUser?.password)
        if (!haspassworddecode) {
            res.status(400).json({ message: "Please enter correct password." })
        }
        const token = jwt.sign({ email: isUser?.email, userId: isUser?._id, role: role }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
        const { password: _, ...userDetails } = isUser.toObject()


        res.cookie('token', token, { expires: new Date(Date.now() + 24 * 3600000) })
        return res.status(200).json({ message: "Login Successfully!", data: { userDetails, token: token } })



    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })

    }
})

authRoute.post('/forget-password', async (req, res) => {
    try {
        const { email, newpassword } = req.body

        const isUser = await Users.findOne({ email: email })
        if (!isUser) {
            return res.status(400).json({ message: "User Not Register!" })
        }
        const hashpassword = await bycrpt.hash(newpassword, 10)

        const updateduser = await Users.findByIdAndUpdate(isUser?._id, { password: hashpassword }, { new: true })
        return res.status(200).json({ message: "Password updated!", data: updateduser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

authRoute.post('/update/profile/:id', UserDataAuth, async (req, res) => {
    try {

        const { id } = req.params
        if (id) {
            if (!req.user._id.equals(id)) {
                return res.status(404).send("please login with other credential");
            }
        }
        const { firstName, lastName, profilPic, address } = req.body

        const updatedUser = await Users.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName, profilPic, address }, { new: true })
        return res.status(200).json({ message: "Profile Updated!", data: updatedUser })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

authRoute.get('/getallchildren', UserDataAuth, async (req, res) => {
    try {
        const { email } = req.user
        const findchildren = await Users.find({
            role: "student",
            "parentInfo.email": email
        })
        const { password: _, ...data } = findchildren
        return res.status(200).json({
            message: "All children",
            data: { data }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})
authRoute.get('/userDetails/:id', UserDataAuth, async (req, res) => {
    try {
        const { id } = req.params

        const findUser = await Users.findById(id)
        return res.status(200).json({
            message: "all data",
            data: findUser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

authRoute.get('/getallstudents', UserDataAuth, async (req, res) => {
    try {
        const { role } = req.user
        if (role != "teacher") {
            res.status(400).json({ message: "It is allow only for teacher." })
        }
        const findusers = await Users.find({role:"student"})
        const { password: _, ...data } = findusers
        return res.status(200).json({
            message: "All children",
            data: { data }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = authRoute