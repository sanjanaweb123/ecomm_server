import express from 'express';
import {
  registerUser,
  login,
  resetPassword,
  forgetPassword,
  GetUserData,
  GetUserDataLIst,
  updateProfile
//   verifyEmail,
//   checkUserExists,
} from '../controllers/userControllers.js';
import { userAuthCheck } from '../utils/middleware.js';

const router = express.Router();

// This api route is using for register the user on the platform
router.post('/register', registerUser);

// This api route is using for login on the platform
router.post('/login', login);

// verify user
//router.patch('/verify/:emailVerificationHash', verifyEmail);

// resetPassword by user
router.post('/resetPass', resetPassword);

//check email already Exist
//router.post('/checkUserExists', checkUserExists);

// forgetPassword by user
router.post('/forgetPass', forgetPassword);

router.get('/getUser', userAuthCheck, GetUserData);

router.get('/getUserList', userAuthCheck, GetUserDataLIst);
router.post('/updateprofile', userAuthCheck, updateProfile);

export default router;
