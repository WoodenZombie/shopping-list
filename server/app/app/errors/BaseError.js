class BaseError extends Error {
  constructor(code, dtoIn, cause) {
    super(cause?.message || code);
    this.code = code;
    this.dtoIn = dtoIn;
    this.cause = cause;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toMap() {
    return {
      code: this.code,
      message: this.message,
      paramMap: {
        dtoIn: this.dtoIn
      }
    };
  }
}

module.exports = BaseError;
