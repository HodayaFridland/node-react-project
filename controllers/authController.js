const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")

const register = async (req, res) => {
    const { username, password, name, email, phone,roles } = req.body
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ username: username }).lean()

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { name, username, password: hashedPwd, email, phone,roles }
    const user = await User.create(userObject)
 
    if (user)
        return res.status(201).json({ message: `New user ${user.username} created` })
    else
        return res.status(400).json({ message: 'Invalid user received' })
}
const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    // console.log(username , password);
    const foundUser = await User.findOne({ username }).lean()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const match=await bcrypt.compare(password,foundUser.password)
    if(!match)
        return res.status(401).json({message:'Unauthorized' })
    //res.send("logged in")
    const userInfo={_id:foundUser._id,name:foundUser.name,
        email:foundUser.email,phone:foundUser.phone,username:foundUser.username, 
        roles:foundUser.roles}
    const accessToken=jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET)
    res.json({"token":accessToken})
}
module.exports = { register, login }
