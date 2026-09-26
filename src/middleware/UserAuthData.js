const jwt = require('jsonwebtoken')
const User = require("../Models/authmodels")
require('dotenv')

const UserDataAuth = async (req, res,next) => {
    try {
        
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({ message: "Please Login First!" })
        }

        const decodetoken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const { userId } = decodetoken

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send("User not found");
        }
       

        req.user = user
        next()
    } catch (error) {
        throw new Error(error)
    }
}

module.exports={UserDataAuth}