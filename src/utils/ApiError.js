class ApiError extends Error {
  constructor(
    statusCode,
    message = "somthing went wrong",
    error = [],
    stack = ""
  ){
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.sucess = false;
    this.errors = errors;

    if(stack){
        this.stack = statck
    }else{
        Error.captureStackTrace(this, this.constructor);
    }

  }
}


export {ApiError}