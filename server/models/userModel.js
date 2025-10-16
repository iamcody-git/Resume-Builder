import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    passowrd:{type:String, required:true},
},{timestamps:true})

userSchema.methods.comparePassword = function(passowrd){
    return bcrypt.compareSync(passowrd, this.passowrd)
}

const User = mongoose.model("User", userSchema)

export default User;