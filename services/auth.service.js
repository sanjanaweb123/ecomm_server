import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'; 
//Jwt
export const signJwt = (id, email) => {
  try {
    const payload = {
      userid: id,
      email: email ? email : false,
    };
    //console.log("process.env.USER_JWT_KEY =>", process.env.USER_JWT_KEY)
    const token = jwt.sign(payload, process.env.USER_JWT_KEY, {
      expiresIn: '80h', // expires in 80 hours
    });
    //console.log("token ==>", token);
    const encryptedToken = encryptData(token);
    //console.log("encryptedToken =>", encryptedToken)
    if (encryptedToken) {
      return encryptedToken;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const encryptData = (data) => {
  try {
    const algorithm = 'aes-192-cbc';
    const password = process.env.CRYPTO_KEY;
    // console.log('password====>', password)
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export const verifyJwt = (token) => {
  if (token) {
    return new Promise((resolve, reject) => {
      const decryptedToken = decryptPass(token);
      if (decryptedToken) {
        jwt.verify(decryptedToken, process.env.USER_JWT_KEY, (err, decoded) => {
          if (err) {
            reject(false);
          } else {
            resolve(decoded);
          }
        });
      } else {
        reject(false);
      }
    });
  }
};

const decryptPass = (encryptedPassword) => {
  try {
    const algorithm = 'aes-192-cbc';
    const password = process.env.CRYPTO_KEY;
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const encrypted = encryptedPassword;
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
};

//bycrypt
export const hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      resolve(hashedPassword);
    } catch (e) {
      console.log('Error in hash ', e);
      reject(false);
    }
  });
};

export const verifyPassword = (password, passwordHash) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isPasswordValid = bcrypt.compareSync(password, passwordHash);
      console.log('i am verified', isPasswordValid);
      resolve(isPasswordValid);
    } catch (e) {
      reject(false);
    }
  });
};






