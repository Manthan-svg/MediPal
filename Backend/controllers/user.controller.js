import { loginExistingUser, registerNewUser } from "../dao/user.dao.js";
import userModel from "../models/user.model.js";
import { validationResultUtil } from "../utlis/validationResult.util.js";

export const  userRegistrationController = async (req,res) => {
    console.log("Hello");
    await validationResultUtil(req, res);
    try{
        const {fullName,email,password,age} = req.body;
        console.log(req.body);
        
        if(!fullName || !email || !password || !age){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        
        const hashedPassword = await userModel.hashedPassword(password);
        if(!hashedPassword){
            return res.status(500).json({
                message: 'Password hashing failed'
            })
        }
        
        const newUser = await registerNewUser(fullName,email,hashedPassword,age);

        if(!newUser){
            return res.status(400).json({
                message: 'User registration failed'
            })
        }
        return res.status(200).json({
            message:'User registered successfully',
            newUser
        })

    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }  
}

export const userLoginController = async (req,res) => {
    await validationResultUtil(req, res);
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }
        const loginUser = await loginExistingUser(email,password);
        if(!loginUser){
            return res.status(400).json({
                message: 'User Login Registration failed'
            })
        }

        return res.status(200).json({
            message:"User logged in successfully",
            user: loginUser,
        })

    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            error: err.message
        })
    }
}