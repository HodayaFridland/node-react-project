// const { json } = require("express")
const Car = require("../models/Car")
const Cart=require("../models/Cart")
const {getCarById} = require("./carController")

const getCart= async (req,res)=>{//לקבל את העגלה של USER הנוכחי
    const userId=req.user._id
    const cartProducts=await Cart.findOne({userId})
    if(!cartProducts)
        return []
    //res.status(400).json({ message: 'cart not found' })
    let arr =[]
    for (let index = 0; index < cartProducts.items.length; index++) {
        let element = cartProducts.items[index];
        let car= await Car.findById(element.productId)
        arr.push({car,quantity:element.quantity,productId:element.productId})
    }
    // const arr =  cartProducts.items.map(async (p)=>{
    //     return await Car.findById(p.productId)
    // })
    // const arr = await Cart.find().populate("Car").lean()
    // console.log(arr);
    res.json(arr)
}
const addProduct=async(req,res)=>{
    const userId = req.user._id
    const {productId}=req.body
    if(!userId)
    return res.status(400).json({ message: 'All fields are required' })
    let cartProducts = await Cart.findOne({userId})//מציאת העגלה של userId הנוכחי
    if (!cartProducts) {//אם אין עגלה צריך ליצור חדשה ולהוסיף לתוכה את המוצר
       cartProducts = await Cart.create({
            userId,
            items: [{ productId, quantity: 1 }]
        })
    }//אם יש עגלה אך אין בה את המוצר הנוכחי
    else{
        const index=cartProducts.items.findIndex(item=>item.productId.toString()===productId)
        if(index>-1){
            cartProducts.items[index].quantity+=1
        }
        else{
        cartProducts.items.push({productId})
        }
    }
    
       const saveCartProducts= await cartProducts.save()
       console.log(saveCartProducts);
       return res.send(saveCartProducts)
}

const  getProductById = async (req,res)=>{
    const {userId}=req.params
    const {productId}=req.body
    const cartProducts= await Cart.findOne({userId})
    
    if (!cartProducts) 
        return res.status(400).json({ message: 'cart not found' })

    const index = cartProducts.items.findIndex(item => item.productId.toString() === productId)
    const product=cartProducts.items[index]
    res.json(product)
}

const deleteProduct =async (req,res)=>{
    console.log("deleteproductcart");
    const {productId}=req.params
    const userId=req.user._id
    const cartProducts= await Cart.findOne({userId}).exec()
    console.log(cartProducts);
    if (!cartProducts) 
        return res.status(400).json({ message: 'cart not found' })
    const index=cartProducts.items.findIndex(item=>item.productId.toString()===productId)
    console.log(index);
    if(cartProducts.items[index].quantity>1){
        console.log(cartProducts.items[index].quantity);
        cartProducts.items[index].quantity-=1
        const result= await cartProducts.save()
    return res.json(result)
    }
    console.log(cartProducts.items[index]);
    const result= await cartProducts.items[index].deleteOne()
    console.log("Afetr delete"+cartProducts.items);
    await cartProducts.save()
    console.log(result);
    //const result2= await cartProducts.save()
    res.json(result)
}
module.exports={getCart,addProduct,getProductById,deleteProduct}