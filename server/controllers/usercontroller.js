let users = require('../db/models/users');
const { param } = require('../routers/userRouter');
const { successfunction, errorfunction } = require('../util/responsehandler')
const bcrypt =require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const sendemail = require('../util/send-email').sendEmail

const dotevn = require('dotenv');
dotevn.config();

    

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

exports.addusers = async function (req, res) {
  try {
    let body = req.body;
    let email = body.email;
    let username = body.username;
    let phoneno = body.phoneno
    let password = body.password



    let otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

    const expirationTime = Date.now() + 1 * 60 * 1000; 

    // Save OTP and other details to the database
    const otpData = new users({
      email,
      otp,
      expirationTime,
      username,
      phoneno,
      password: hashedPassword,
  
    });

    let newUser = await users.create(otpData);

    // let content = await sendOtpEmail(email, name, otp);
    // await sendemail(email, "OTP Verification", content);

    return res.status(200).send({
      success: true,
      data : newUser,
      message: "OTP has been sent to your email. Please verify."
    });

  } catch (error) {
    console.log("Error:", error);
    let response = {
      success: false,
      statuscode: 400,
      message: "Error while sending OTP"
    };
    return res.status(response.statuscode).send(response);
  }
};

exports.verifyOtp = async function (req, res) {
  try {
    let body = req.body;
    let email = body.email;
    let otp = body.otp

    console.log("Email:", email);
    console.log("OTP:", otp);


    let otpRecord = await users.findOne({email,otp});
    console.log("otprecord",otpRecord);

    if (!otpRecord) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP."
      });
    }

    // Check if OTP has expired
    if (Date.now() > otpRecord.expirationTime) {
      return res.status(400).send({
        success: false,
        message: "OTP has expired."
      });
    }

    // OTP is valid, proceed with other actions, like creating the user in your main collection
    return res.status(200).send({
      success: true,
      message: "OTP verified successfully."
    });

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Server error."
    });
  }
};
exports.singleusers = async function(req,res){

    try {
     let single_id = req.params.id;
     console.log('id from single',single_id);
 
     let one_data = await users.findOne({_id: single_id})
     console.log('one_data',one_data);
 
     let response = successfunction({
         success: true,
         statuscode: 200,
         message: "single view success",
         data:one_data
         
     })
     res.status(response.statuscode).send(response)
     return;
 
    } catch (error) {
     console.log("error",error);
 
     let response = errorfunction({
         success: false,
         statuscode: 400,
         message: "error"
         
     })
     res.status(response.statuscode).send(response)
     return;
 
    }
 
 
     
 };

exports.resetPassword=async function(req,res){

}