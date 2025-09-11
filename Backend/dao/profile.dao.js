import userModel from "../models/user.model.js";

export const getProfileDao = async (user) => {
    const profileUser = await userModel.findById(user._id);
        if (!profileUser) {
            throw new Error('User profile not found');
        }
    return profileUser;
}

export const updateProfileDao = async (user,updates) => {
    const updateUserProfileFields = await userModel.findByIdAndUpdate(
        user._id,
        { $set: updates },
        { new: true, runValidators: true }
    );
    const updatedUser = await updateUserProfileFields.save();
    if (!updatedUser) {
        throw new Error('Error updating user profile');
    }
    return updatedUser;
}