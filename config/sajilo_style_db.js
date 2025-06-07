const mongoose = require("mongoose")

const CONNECTING_STRING = process.env.MONGODB_URI
const connectDB = async () => {
    try{
        await mongoose.connect(
            CONNECTING_STRING,
            {
                useNewUrlParser:  true,
                useUnifiedTopology: true
            }
        )
        console.log("Mongodb connected")
    }catch(err){
        console.log("DB error", err)
    }
}
module.exports = connectDB
