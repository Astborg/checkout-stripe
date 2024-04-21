const express = require('express')
const cookieSession = require('cookie-session')
const cors = require('cors')
require('dotenv').config()
const stripeRouter = require('./stripe/stripe.router')
const productRouter = require('./stripe/stripe.router')
const verifyRouter = require('./stripe/stripe.router')
const registerRouter = require('./stripe/stripe.router')

const authRouter = require("./resources/auth/auth.router")
const app = express()

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}))

app.use(express.json())

app.use(cookieSession({
    name: 'session',
    keys: ["s3cr3tk3y"],
    maxAge: 1000 * 60 * 60
}))

//Routes
app.use("/api/auth", authRouter)

app.use('/payments', stripeRouter)
app.use('/api', productRouter)
app.use('/payments', verifyRouter)
app.use('/api', registerRouter)

app.listen(3005, () => console.log('Server is up running...'))