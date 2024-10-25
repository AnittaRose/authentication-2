const mongoose = require('mongoose');


const users = new mongoose.Schema({

    username :{
        type:String
    },
    email :{
        type:String
    },
    password :{
        type:String
    },
    phoneno :{
        type:Number
    },
    otp: {
        type: String,
    },
    expirationTime: {
        type: Date,
    },
    password_token : {
        type : String
    }
});

module.exports =mongoose.model("users",users);
