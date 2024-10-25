const express = require ('express');
const router = express.Router();
const usercontroller = require ('../controllers/usercontroller');



router.post('/user',usercontroller.addusers);
router.post('/Otp',usercontroller.verifyOtp);
router.get('/users/:id',usercontroller.singleusers);
router.put('/resetPassword/:id',usercontroller.resetPassword)
router.post('/forgotpassword',usercontroller.forgot);
router.patch('/reset-password',usercontroller.resetcontroller)



module.exports = router;
