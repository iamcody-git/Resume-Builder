import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import { use } from 'react'

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
        newUser.password = undefined;
        return res.status(201).json({message:'User created succesfully', token, user:newUser})

    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }

}

//controller for user login
// POST:/api/users/login

export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body;

        // check if user alreday exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:'Invalid email or passowrd'})
        }


        // check if password is correct
        if(!user.comparePassword(password)){
             return res.status(400).json({message:'Invalid email or passowrd'})


        }

        // return success message
        const token = generateToken(user._id)
        user.password = undefined;
        return res.status(201).json({message:'Login successfully', token, user})

    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }

}

//controller for getting user by id
// POST:/api/users/data

export const getUserById = async (req, res)=>{
    try {
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message:'User not found'})

        }

        //return user
        user.password = undefined;
        return res.status(400).json({user})

        

    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }

}

