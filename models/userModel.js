const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please Enter your name!"]
    },
    email : { 
        type : String,
        required : [true,"Please Enter your email!"],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail,"Please enter a valid email!"]
    },
    photo : String,
    password : {
        type : String,
        required : [true,"Please enter your password"],
        minlength : [8, "Minimum length of the password should be 8!"],
        select : false
    },
    confirmPassword : {
        type : String,
        required : [true,"Please confirm your password"],
        validate : {
            validator : function(val){
                return val == this.password;
            },
            message : 'Password and Confirm Password does not match!'
        }
    },
    passwordChangedAt : Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
})

userSchema.methods.comparePasswords = async function(password,userPassword){
    return await bcrypt.compare(password,userPassword);
}

userSchema.methods.isPasswordChanged = async function(JwtTimeStamp){
    const pswdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000 ,10);
    if(this.passwordChangedAt){
        console.log(JwtTimeStamp,this.passwordChangedAt);
        return pswdChangedTimeStamp > JwtTimeStamp;
    }
    return false;
}

const User = mongoose.model("User",userSchema);

module.exports = User;