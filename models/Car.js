const mongoose=require("mongoose")
const carSchema=new mongoose.Schema({
model:{
    type:String,
    required:true,
    unique: true
},
modelyear:{
type:Date,
required:true,
},
color:{
    type:String,
    enum:['red', 'blue','gray','black','white'],
    default:"black",
    required:true
    },
price:{
type:Number,
required:true
},
capacity:{
    type:Number,
    required:true  
},
topspeed:{
    type:Number,
    required:true  
},
chargingtime:{
    type:Number,
    required:true  
},
img:{
    type:String,
    required:true 
}


},{timestamps:true})
module.exports=mongoose.model("Car",carSchema)