const express = require ('express');
const router = express.Router();
const usercontroller = require ('../controllers/usercontroller');



router.post('/user',usercontroller.addusers);
router.post('/Otp',usercontroller.verifyOtp);
router.get('/users/:id',usercontroller.singleusers);
router.put('/resetPassword/:id',usercontroller.resetPassword)



module.exports = router;
