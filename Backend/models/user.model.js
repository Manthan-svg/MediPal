import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    fullName:{
        firstName:{
            type:String
        },
        lastName:{
            type:String
        }
    },
    profileImage:{
        type:String,
        default:'https://www.w3schools.com/howto/img_avatar.png'
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5, 'Email must be at least 5 characters long'],
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password:{
        type:String,
        required:true,
        minlength:[6, 'Password must be at least 6 characters long'],
        select:false 
    },
    age:{
        type:Number,
        min:[0, 'Age must be a positive number'],
        default: 0
    }
})

userSchema.statics.hashedPassword = async function(password){
    return await bcrypt.hash(password, 10); 
}
userSchema.methods.generateToken = async function(){
    return await jwt.sign({userId:this._id,email:this.email},process.env.JWT_SECRET_KEY);
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


const userModel = new mongoose.model('User',userSchema);

export default userModel;
