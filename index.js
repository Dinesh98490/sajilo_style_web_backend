require('dotenv').config()
const CONNECTION_STRING = process.env.MONGODB_URI
const express = require("express")
const connectDB = require("./config/sajilo_style_db")
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")
const adminUserRoutes = require("./routes/admin/adminUserRoutes")
const productRoutes = require("./routes/admin/productRoutes")
const categoryRoutes = require("./routes/admin/categoryRoutes");
const customerRoutes = require("./routes/admin/customerRoutes")
const orderRoutes = require("./routes/admin/orderRoutes")
const paymentRoutes = require("./routes/admin/paymentRoutes")
const shipmentRoutes = require("./routes/admin/shipmentRoutes")
const  cartRoutes = require("./routes/cartRoutes")
const chatBotRoute=require("./routes/chatBotRoute")
const app = express()

let corsOptions = {
    origin: "*",
  
  }
  app.use(cors(corsOptions))




connectDB()

app.use(express.json()) 
app.use('/uploads', express.static('uploads'));


//implement the routes
app.use("/api/auth", userRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/product", productRoutes)
app.use("/api/admin/category", categoryRoutes)
app.use("/api/admin/customer", customerRoutes)
app.use("/api/admin/order", orderRoutes)
app.use("/api/admin/payment", paymentRoutes)
app.use("/api/admin/shipment", shipmentRoutes)
app.use("/api/chatbot", chatBotRoute);
app.use("/api/customer/cart", cartRoutes)





const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Sajilo Style running on server", PORT) 
    }
)

