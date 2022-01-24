const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getTokenFromReq = (req) => {
  return req.headers.authorization.split(" ")[1]; // Authorization : Bearer adsfsadfkjasdlfjsdalkf
};

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      throw new Error();
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECURITY_KEY);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new HttpError("USERID_NOT_EXISTS", 404));
    }

    req.userData = { id: decodedToken.id };
    next();
  } catch (error) {
    console.log(error);
    return next(new HttpError("AUTHORIZATION_FAILED", 401));
  }
};
