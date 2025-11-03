const Car=require("../models/Car")
const { login } = require("./authController")

const getAllCars= async (req,res)=>{
    const cars=await Car.find()
    if(!cars)
        return res.status(400).json({ message: 'cars not found' })
    res.json(cars)
}
const addNewCar=async(req,res)=>{
    const {model,modelyear,color,price,capacity,topspeed,chargingtime,img}=req.body
    if(!model||!modelyear||!color||!price||!capacity||!topspeed||!chargingtime||!img)
    return res.status(400).json({ message: 'All fields are required' })
    const duplicate = await Car.findOne({ model }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate car" })
    }
   const car=await Car.create({model,modelyear,color,price,capacity,topspeed,chargingtime,img})
   if(car)
     return res.status(201).json({ message: `New car ${car.model} created` })
//    res.json(car)
}
const  getCarById = async (req,res)=>{
    const {id}=req.params
    const car= await Car.findById(id)
    if (!car) 
        return res.status(400).json({ message: 'car not found' })
    res.json(car)
}
const updateCar = async (req,res)=>{
    const {_id,model,modelyear,color,price,capacity,topspeed,chargingtime,img}=req.body
    if (!_id) 
        return res.status(400).json({ message: 'id is required' })
    const car= await Car.findById(_id)
    if (!car) 
        return res.status(400).json({ message: 'car not found' })
    car.model=model
    car.modelyear=modelyear
    car.color=color
    car.price=price
    car.capacity=capacity
    car.topspeed=topspeed
    car.chargingtime=chargingtime
    car.img=img
    const updateCar= await car.save()
    res.json(updateCar)
}
const deleteCar =async (req,res)=>{
    console.log("deletecar");
    const {id}=req.params
    console.log(id);
    if (!id) 
        return res.status(400).json({ message: 'id is required' })
    const car=await Car.findById(id)
    console.log(car);

    if (!car) 
        return res.status(400).json({ message: 'car not found' })
    const result= await car.deleteOne()
    res.json(result)
}
module.exports={getAllCars,addNewCar,getCarById,updateCar,deleteCar}

