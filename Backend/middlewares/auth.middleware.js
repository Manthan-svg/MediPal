import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import { validationResultUtil } from '../utlis/validationResult.util.js';



export const authMiddleware =async  (req,res,next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1] || req.cookies;
        console.log("token" , token)
        if(!token){
            return res.status(401).json({
                message:"Unauthorized access, token is missing or invalid"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized access, token is invalid"
            })
        }   
        const user = await userModel.findById(decoded.userId);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({  
            message: 'Unauthorized access',
            error: err.message
        });
    }
}

