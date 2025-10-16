import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'

const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET, {expiresIn:'7d'} )
    return token

}


// controller for user registeration

// POST:/api/users/register
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;

        // check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message:'Missing required fields'})
        }

        // check if user alreday exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:'User already exists'})
        }

        // create a new user
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name , email, password:hashedPassword
        })

        // return success message
        const token = generateToken(newUser._id)

    } catch (error) {
        
    }

}