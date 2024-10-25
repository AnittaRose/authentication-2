let users = require('../db/models/users');
const { successfunction, errorfunction } = require('../util/responsehandler')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
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
  try {
    
    let  _id = req.params.id
    console.log(_id);

    let user = await users.findOne({_id : _id})
    console.log('user',user);

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
    console.log("passwordmatch",passwordMatch);

    if(passwordMatch){
      
      let newpassword = req.body.newpassword;

      let salt = bcrypt.genSaltSync(10);
      let hashed_password = await bcrypt.hash(newpassword,salt);

      console.log("hashedpassword",hashed_password);

      req.body.password=hashed_password
      console.log("new password",req.body.password)

      let updatePassword = await users.updateOne({_id},{$set:{password : req.body.password}});
      console.log(updatePassword)


            let response = successfunction({
                success: true,
                statuscode: 200,
                data :updatePassword,
                message: "successfully reset...."
            })
            res.status(response.statuscode).send(response)
            return;


        }
      
    }catch (error) {
      console.log("error : ", error);
      let response = errorfunction({
          success: false,
          statuscode: 400,
          message: "error"
      })
      
      res.status(response.statuscode).send(response)
      return;
    } 
    
  };

exports.forgot = async function (req, res) {
    try {
        let email = req.body.email;
        if (email) {
            let user = await users.findOne({ email: email });
            console.log("user", user);

            if (user) {
                let reset_token = jwt.sign(
                    { user_id: user._id },
                    process.env.PRIVATE_KEY,
                    { expiresIn: "10d" }
                );

                let data = await users.updateOne({ email: email },{ $set: { password_token: reset_token } }
              );
              
                
                console.log("email for update:", email);
                console.log("user found:", reset_token);
                console.log("update data:", data); // Log the update result

                if (data.matchedCount === 1 && data.modifiedCount === 1) {
                    let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
                    let email_template = await resetpasswords(user.first_name, reset_link);
                    sendemail(email, "Forgot password", email_template);
                    let response = successfunction({
                        status: 200,
                        message: "Email sent successfully",
                        data:reset_token
                    });
                    res.status(response.statuscode).send(response);
                } else if (data.matchedCount === 0) {
                    let response = errorfunction({
                        status: 404,
                        message: "User not found",
                    });
                    res.status(response.statuscode).send(response);
                } else {
                    let response = errorfunction({
                        status: 400,
                        message: "Password reset failed",
                    });
                    res.status(response.statuscode).send(response);
                }
            } else {
                let response = errorfunction({ status: 403, message: "Forbidden" });
                res.status(response.statuscode).send(response);
            }
        } else {
            let response = errorfunction({
                status: 422,
                message: "Email is required",
            });
            res.status(response.statuscode).send(response);
        }
    } catch (error) {
        console.log("Error in forgetPassword:", error);
        let response = errorfunction({
            status: 500,
            message: "Internal Server Error",
        });
        res.status(response.statuscode).send(response);
    }
};

exports.resetcontroller = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    console.log("authheadeer",authHeader)
    const token = authHeader.split(" ")[1];
    console.log("token",token);

    let password = req.body.password;
    console.log("password :",password);



    decoded = jwt.decode(token);
    console.log("decoded : ",decoded);

    let user = await users.findOne({
      $and: [{ _id: decoded.user_id }, { password_token: token }],
    });
    console.log("user",user)
    if (user) {
      let salt = bcrypt.genSaltSync(10);
      let password_hash = bcrypt.hashSync(password, salt);
      let data = await users.updateOne(
        { _id: decoded.user_id },
        { $set: { password: password_hash, password_token: null } }
      );
      if (data.matchedCount === 1 && data.modifiedCount == 1) {
        let response = successfunction({
          status: 200,
          message: "Password changed successfully",
        });
        res.status(response.statuscode).send(response);
        return;
      } else if (data.matchedCount === 0) {
        let response = errorfunction({
          status: 404,
          message: "User not found",
        });
        res.status(response.statuscode).send(response);
        return;
      } else {
        let response = errorfunction({
          status: 400,
          message: "Password reset failed",
        });
        res.status(response.statuscode).send(response);
        return;
      }
    }else{
      let response = errorfunction({ status: 403, message: "Forbidden" });
    res.status(response.statuscode).send(response);
    return;
    }

    
  }  catch (error) {
    console.log("error : ", error);
    let response = errorfunction({
        success: false,
        statuscode: 400,
        message: "error"
    })
    res.status(response.statuscode).send(response)
    return;
  }
};

