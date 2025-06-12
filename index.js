require('dotenv').config()
const CONNECTION_STRING = process.env.MONGODB_URI
const express = require("express")
const connectDB = require("./config/sajilo_style_db")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")
const adminUserRoutes = require("./routes/admin/adminUserRoutes")
const app = express()

let corsOptions = {
    origin: "*",
  
  }
  app.use(cors(corsOptions))




connectDB()

app.use(express.json()) 


//implements the routes
app.use("/api/auth", userRoutes)
app.use("/api/admin/user", adminUserRoutes)









const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Sajilo Style", PORT)
    }
)

