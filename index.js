require('dotenv').config()
const CONNECTION_STRING = process.env.MONGODB_URI
const express = require("express")
const connectDB = require("./config/sajilo_style_db")
const userRoutes = require("./routes/userRoutes")
const adminUserRoutes = require("./routes/admin/adminUserRoutes")
const app = express()




//connect to the database
connectDB()

app.use(express.json()) // accept  json in request


//implements the routes
app.use("/api/auth", userRoutes)
app.use("/api/admin/user", adminUserRoutes)









const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running", PORT)
    }
)

