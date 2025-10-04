import { getProfileDao, updateProfileDao } from "../dao/profile.dao.js";
import userModel from "../models/user.model.js";
import { validationResultUtil } from "../utlis/validationResult.util.js";

export const getUserProfileController = async (req,res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({
                message: 'User not found'   
            });
        }
        const profileUser =  await getProfileDao(user);
        if (!profileUser) {
            return res.status(404).json({
                message: 'User profile not found'
            });
        }
        return res.status(200).json({
            message: 'User profile retrieved successfully',
            user: profileUser
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const updateUserProfileController = async (req,res) => {
    await validationResultUtil(req,res);
    try{
        const user = req.user;
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        const updates = req.body;
        const updatedUser = await updateProfileDao(user,updates);
        return res.status(200).json({
            message:"User profile updated successfully",
            user: updatedUser
        });
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error.",
            error: err.message
        })
    }
}

export const updateUserProfileImageController  = async (req,res) => {
    
    try {
        const userId = req.params.userId; // better than using req.user here
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/profileImages/${req.file.filename}`;
    
        const updatedUserProfile = await userModel.findByIdAndUpdate(
          userId,
          { profileImage: fileUrl },
          { new: true }
        );
    
        return res.status(200).json({
          message: "Profile Image changed successfully",
          user: updatedUserProfile,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating profile image" });
      }
}

export const changePasswordController = async(req,res) => {
    validationResultUtil(req,res);
    try{
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        console.log(currentPassword,newPassword);
        
        const user = await userModel.findById(req.user._id).select('+password');
        
        const isMatch = await user.comparePassword(currentPassword);
        console.log(isMatch);
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid current password"
            })
        }

        const hashedPassword = await userModel.hashedPassword(newPassword);

        const changedNewPassword = await userModel.findByIdAndUpdate(user._id,{$set:{password:hashedPassword}});

        if(!changedNewPassword){
            return res.status(400).json({
                message:"Failed to change new password"
            })
        }

        return res.status(200).json({
            message:"New password changed successfully",
            user:changedNewPassword
        })

    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}