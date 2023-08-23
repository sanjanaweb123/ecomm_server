// registering dealers account users
import { checkIfEmpty } from '../utils/checkValidate.js';
import userModel from '../models/userModel.js';
//import generateHex from '../utils/generateHex.js';
import {  hashPassword, verifyPassword, signJwt } from '../services/auth.service.js';
import { ErrorHandler } from '../helper/error.js';

//import generatePassword from '../utils/generatePassword.js';
//import { generateUserName } from '../utils/generateUserName.js';
export const registerUser = async (req, res, next) => {
  /**
   * This is the user api for register user on the platform when user registerd
   */
  try {
    const {
      email,
      firstname,
      lastname,
      password,
      mobile  
    } = req.body;
    const registerObject = {
      email,
      password,
      firstname,
      lastname,
      mobile,
    };
    const { isValid } = checkIfEmpty(registerObject);
    if (!isValid) {
      return next(new ErrorHandler(422, 'Invalid request !!'));
    }
    const isExistEmail = await userModel.findOne({ email }).lean();
    if (isExistEmail) {
      return next(new ErrorHandler(401, 'Email already exist !'));
    }
    const passwordVal = await hashPassword(password);
    const requestBody = {
      ...registerObject,
      password:passwordVal
    };
    const { _id } = await userModel.create(requestBody);
    res.send({
      code: 200,
      msg: "Register Success fully!",
      id: _id,
    });
  } catch (e) {
    next(e);
  }
};

// logging user
export const login = async (req, res, next) => {
  try {
    /**
     * This api is used for login the user on the platform
     */
    const { email, password } = req.body;
    const loginUser = await userModel.findOne(
      {
        email: email,
      }
    );
    if (loginUser) {
      const { isVerified, _id } = loginUser || {};
        const cmp = await verifyPassword(password, loginUser.password);
        if (cmp) {
          const token = signJwt(_id, loginUser.email);
          res.send({
            code: 200,
            msg: 'Login Successfully',
            token: token,
            userid: _id,
          });
        } else {
          return next(new ErrorHandler(401, 'Invalid Credentials'));
        }
      
    } else {
      return next(new ErrorHandler(404, 'User not found'));
    }
  } catch (error) {
    next(error);
  }
};


// forget Password
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('REQest ====>', req.body);
    const findUser = await userModel
      .findOne({
        $or: [{ email: email }, { mobile: email }],
        isDeleted: false,
      })
      .lean();
    if (findUser) {
      const changeValue = {
        forgetPassHash: await hashPassword(JSON.stringify(findUser._id)),
        forgetPassCreatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      };
      const checkModified = await userModel.updateOne(
        {
          $or: [{ email: email }, { mobile: email }],
        },
        changeValue
      ); 
      res.send({
        code: 200,
        msg: 'Change password link sended to your registered email',
        changeValue,
      });
    } else {
      return next(new ErrorHandler(404, 'Email or Phone Number not found'));
    }
  } catch (error) {
    next(error);
  }
};

// reset password API
export const resetPassword = async (req, res, next) => {
  try {
    console.log('Request Body===>', req.body);
    const { password, token } = req.body;
    const userData = await userModel.findOne({
      forgetPassHash: token,
      isDeleted: false,
    });
    console.log('UserDATA check', userData);
    if (userData) {
      let currentdatetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      let olddatetime = userData.forgetPassCreatedAt;
      let date1 = new Date(currentdatetime);
      let date2 = new Date(olddatetime);
      let diff = Math.trunc(Math.abs(date1 - date2) / 36e5);
      console.log('Check differ===', diff);
      if (diff < 24) {
        await userModel.updateOne(
          {
            _id: userData._id,
            isDeleted: false,
          },
          {
            forgetPassHash: 'done',
            password: await hashPassword(password),
            passwordChangedAt: Date.now() - 1000,
          }
        );
        res.send({
          code: 200,
          msg: 'Password reset sucessfully',
        });
      } else {
        return next(new ErrorHandler(500, 'reset password link was expired'));
      }
    } else {
      return next(new ErrorHandler(500, 'Invalid link'));
    }
  } catch (error) {
    next(error);
  }
};

export const GetUserData = async (req, res, next) => {
  try {
    const {
      tokenData: { userid },
    } = req;
    const data = await userModel
      .findOne({ _id: userid}, {
        password:0,
        isDeleted:0,
        isVerified:0
      }).lean();
    res.send({ code: 200, data });
  } catch (e) {
    next(e);
  }
};


export const GetUserDataLIst = async (req, res, next) => {
  try {
    const data = await userModel
      .find().lean();
    res.send({ code: 200, list:data });
  } catch (e) {
    next(e);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      firstname, lastname, email, _id, mobile
    } = req.body || {}
       await userModel.updateOne({
        _id
       },{
        firstname, lastname, email, mobile
       })
       res.send({ code: 200, msg:'Updated' });
  } catch (e) {
    next(e);
  }
};
