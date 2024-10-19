// const successfunction = require('../util/')
const users = require ('../db/models/users')
const { successfunction, errorfunction } = require('../util/responsehandler')
const bcrypt = require ('bcrypt')
const jwt =require('jsonwebtoken')

exports.login = async function (req,res){
    try {
        // let body =req.body
        
        let email = req.body.email;
        console.log('email',email);

        let password = req.body.password
        console.log('password',password);

        
    
        let view = await users.findOne({email})
        console.log('view',view);

        if(view){
            let user_password = view.password;
            console.log("user_password ",user_password)

            let password_match = bcrypt.compareSync(password,user_password); 
            console.log("passsword match",password_match)


            if(password_match){
                let token = jwt.sign({user_id : view._id},process.env.PRIVATE_KEY,{expiresIn : "10d"})
                console.log('token',token)
                // console.log("user_id",view._id);

                let id= view._id;
                console.log('id',id)

                

                let token_data ={
                    token,
                    id,
                    
                }
                

                let response = successfunction({
                    success: true,
                    statuscode: 200,
                    data: token_data,
                    message: "Login Successfully.."
              
                    
                })
                res.status(response.statuscode).send(response)
                return;
            }else{
                let response = errorfunction({
                    success: false,
                    statuscode:400,
                    message : "Invalid password......",
                });
                res.status(response.statuscode).send(response);
                return;
            }}else{
                let response = errorfunction({
                    statuscode: 404,
                    message: "Invalid password.....",
                });

                res.status(response.statuscode).send(response);
                return;
            }

           
        }catch (error) {
        console.log('error',error);

        let response = errorfunction({
            success: false,
            statuscode: 400,
            message: "error"
            
        })
        res.status(response.statuscode).send(response)
        return;
    }
}
