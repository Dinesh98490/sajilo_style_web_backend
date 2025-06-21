require('dotenv').config()
const CONNECTION_STRING = process.env.MONGODB_URI
const express = require("express")
const connectDB = require("./config/sajilo_style_db")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")
const adminUserRoutes = require("./routes/admin/adminUserRoutes")
const productRoutes = require("./routes/admin/productRoutes")
const categoryRoutes = require("./routes/admin/categoryRoutes");
const app = express()

let corsOptions = {
    origin: "*",
  
  }
  app.use(cors(corsOptions))




connectDB()

app.use(express.json()) 


//implement the routes
app.use("/api/auth", userRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/product", productRoutes)
app.use("/api/admin/category", categoryRoutes)





const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Sajilo Style running on server", PORT) 
    }
)

