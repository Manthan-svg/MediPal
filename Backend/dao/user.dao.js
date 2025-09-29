import userModel from "../models/user.model.js";

export const registerNewUser = async (fullName,email,hashedPassword,age, username) => {
    const newUser = await new userModel({
        fullName:{
            firstName: fullName.firstName,
            lastName: fullName.lastName
        },
        email: email,
        password: hashedPassword,
        age: age,
        username: username
    }).save();

    if(!newUser) {
        throw new Error('User registration failed');
    }

    const token = await newUser.generateToken();
    if(!token) {
        throw new Error('Token generation failed');
    }

    // sanitize sensitive fields
    const safeUser = newUser.toObject();
    delete safeUser.password;

    return {newUser: safeUser, token};
}

export const loginExistingUser = async (email, password) => {
    const user = await userModel.findOne({ email: email }).select('+password');
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
    }
    const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
    }
    const token = await user.generateToken();
        if(!token){
            return res.status(500).json({
                message: 'Token generation failed'
            })
    }
    // sanitize sensitive fields
    const safeUser = user.toObject();
    delete safeUser.password;

    return { user: safeUser, token };
}