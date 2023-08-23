export class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      console.log('status',statusCode,'message',message)
      this.statusCode = statusCode;
      this.message = message;
    }
  }
  export const handleError = (err, res) => {
    let { statusCode, message } = err;
    console.log('error',statusCode, message)
    if (!statusCode || !message) {
      statusCode = 500;
      message = 'Internal server error';
    } 
    res.send({
        code:statusCode,
        msg: message,
    });
  };
  