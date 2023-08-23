import { verifyJwt } from '../services/auth.service.js';
import userModel from '../models/userModel.js';
import multer from 'multer';

// Set the destination and filename for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/images/') // Destination folder where the uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Unique filename to avoid overwriting
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
}

// Set up multer middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });


export const userAuthCheck = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1];
      const isTokenValid = await verifyJwt(token);
      if (isTokenValid) {
        const userdValid = await userModel.findOne({ _id: isTokenValid.userid });
        if (!userdValid) {
        res.send({
            code: 400,
            msg: 'Authentication is required',
        });
        }else{
            req.tokenData = isTokenValid;
            next();
        }
      } else {
        res.send({
          code: 400,
          msg: 'Authentication is required',
        });
      }
    } else {
      res.send({
        code: 400,
        msg: 'Authentication is required',
      });
    }
  } catch (e) {
    console.log('ERROR ', e);
    res.send({
      code: 444,
      msg: 'Some error has occured!',
    });
  }
};


export const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Multer error: ' + err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Error occurred during file upload: ' + err.message });
    }
    next();
  });
};


