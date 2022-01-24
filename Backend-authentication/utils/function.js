const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
module.exports = {
  tryCatchBlockWithValidate: (validate, callbackFunc) => {
    return async (req, res, next) => {
      if (validate) {
        const inputIsValid = validate(req.body);
        if (!inputIsValid) return next(new HttpError("REQUEST_INVALID_INPUT", 400));
      }

      try {
        return await callbackFunc(req, res, next);
      } catch (error) {
        console.log(error);
        return next(new HttpError("SERVER_INTERNAL_ERROR", 500));
      }
    };
  },
  createToken: (payload) => {
    token = jwt.sign(payload, process.env.TOKEN_SECURITY_KEY, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    return token;
  },
  getTokenFromReq: (req) => {
    return req.headers.authorization.split(" ")[1];
  },
  minimizeUser: (user) => {
    const { username, fullname, email, address } = user;
    return {
      id: user["_id"].toString(),
      username,
      fullname,
      email,
      address,
    };
  },
};
