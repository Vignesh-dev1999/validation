const express = require("express")
require('dotenv').config()
require("./database/mongodb")
const userRoute =  require("./routes/userRoutes")

const app = express()
app.use(express.json())

app.use("/",userRoute)


app.listen(process.env.PORT || 3000)