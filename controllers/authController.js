const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');

const signToken = function(id){
    const token = jwt.sign({id: id},process.env.SECRET_STR,{
        expiresIn: process.env.LOGIN_EXPIRES
    });
    return token;
}
exports.createUser = async (req,res)=>{
    try{
        const user = await userModel.create(req.body);
        const token = signToken(user._id);
        res.status(201).json({
            status:'success',
            token,
            data:{
                user
            }
        })
    }catch(error){
        res.status(400).json({
            status:'fail',
            message: error.message
        })
    }
}

exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                status:'fail',
                message: 'Both Email and Password are required to login!'
            })
        }
        const user = await userModel.findOne({email}).select('+password');
        if(!user || !(await user.comparePasswords(password,user.password))){
            return res.status(400).json({
                status:'fail',
                message: 'Enter valid email and password!'
            })
        }
        const token = signToken(user._id);
        res.status(200).json({
            status : 'success',
            token
        })
    }catch(error){
        res.status(400).json({
            status:'fail',
            message: error.message
        })
    }
}

exports.protect = async (req,res,next) => {
    try{
        const testToken = req.headers.authorization;
        let token;
        //1. check if token exists
        if(testToken && testToken.startsWith('bearer')){
            token = testToken.split(' ')[1];
        }
        if(!token){
            return res.status(401).json({
                status:'fail',
                message: "You are not logged in!"
            })
        }
        //2. check if token is valid
        const decodedToken = await util.promisify(jwt.verify)(token,process.env.SECRET_STR);
        //3. if user exist
        const user = await userModel.findById(decodedToken.id);
        if(!user){
            return res.status(401).json({
                status:'fail',
                message: 'The user with given token does not exist'
            })
        }
        //4. if user changed password after token generation 
        if(await user.isPasswordChanged(decodedToken.iat)){
            return res.status(401).json({
                status:'fail',
                message: 'Password has changed recently, Please login again !'
            })
        }
    }catch(error){
        return res.status(400).json({
            status:'fail',
            message: error.message
        })
    }
    next();
}