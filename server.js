require("dotenv").config()
const express=require("express")
const cors=require("cors")
const corsOptions=require("./config/corsOptions")
const connectDB=require("./config/dbConn")

const app=express()
connectDB()
const { default: mongoose } = require("mongoose")
const PORT=process.env.PORT||1500
app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/auth",require("./routs/authRouts"))
app.use("/api/cars",require("./routs/carRouts"))
app.use("/api/cart",require("./routs/cartRouts"))


mongoose.connection.once('open', () => {
console.log('Connected to MongoDB')
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
console.log(err)
})
