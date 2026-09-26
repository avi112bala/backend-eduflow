const express=require('express')
const cors=require('cors')
require('dotenv').config()
const cookiesParser=require('cookie-parser')
const connectDB = require('./src/config/connectDB')
const authRoute = require('./src/Routes/Authroutes')
const attandanceRoute = require('./src/Routes/Attandance')
const subjectRoute = require('./src/Routes/Subject')
const testRoutes = require('./src/Routes/testRoute')
const teacherRoutes = require('./src/Routes/teacherRoutes')
const feeRouter = require('./src/Routes/feepayment')
const scheduleRouter = require('./src/Routes/schedule')
const materialRoutes = require('./src/Routes/materialRoutes')
const doubtRoute = require('./src/Routes/doubtroutes')
const studentLeaveRouter = require('./src/Routes/studentsLeave')
const testscorerouter = require('./src/Routes/testScoreRoutes')
const quizrouter = require('./src/Routes/quizRoutes')
const app=express()

app.use(express.json())
app.use(cookiesParser())

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Or callback(null, origin) to allow live frontend
        }
    },
    credentials: true
}))


app.use('/',authRoute)
app.use('/',attandanceRoute)
app.use('/',subjectRoute)
app.use('/',testRoutes)
app.use('/',teacherRoutes)
app.use('/',feeRouter)
app.use('/',scheduleRouter)
app.use('/',materialRoutes)
app.use('/',doubtRoute)
app.use('/',studentLeaveRouter) 
app.use('/', testscorerouter);
app.use('/', quizrouter);

const PORT=7777||process.env.PORT




connectDB().then(()=>{
    try {
        app.listen(PORT,()=>{
        console.log(`Database Connected Successfully!`)
        console.log(`Server is Listing on ${PORT}`) 
    })
    } catch (error) {
        console.log(error)
    }
})
