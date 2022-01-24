const { tryCatchBlockWithValidate, minimizeUser, getTokenFromReq, createToken } = require("../utils/function");
const singUpInfoSchema = require("../schemas/signUpInfo");
const loginInfoSchema = require("../schemas/loginInfo");
const encryptByMd5 = require("md5");
const userSchema = require("../schemas/user");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//story1
exports.login = tryCatchBlockWithValidate(loginInfoSchema, async (req, res, next) => {
  const loginInfo = { username: req.body.username, password: req.body.password };

  const user = await User.findOne(loginInfo);
  if (!user) {
    return next(new HttpError("USER_INVALID_LOGIN_INFO", 400));
  }

  const minimizedUser = minimizeUser(user);
  const token = createToken(minimizedUser);

  return res.status(200).send({ token: token });
});

//story2
exports.tokenRenew = async (req, res, next) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      throw new Error();
    }

    const decodedData = jwt.verify(token, process.env.TOKEN_SECURITY_KEY);
    delete decodedData.iat;
    delete decodedData.exp;

    const newToken = createToken(decodedData);
    return res.status(200).send({ token: newToken });
  } catch (error) {
    console.log(error);
    next(new HttpError("TOKEN_INVALID", 401));
  }
};

//story3
exports.addAccount = tryCatchBlockWithValidate(userSchema, async (req, res, next) => {
  const usernameIsExisted = await User.findOne({ username: req.body.username });
  if (usernameIsExisted) {
    return next(new HttpError("USER_EXISTED_USERNAME", 409));
  }

  const user = new User(req.body);
  await user.save();

  return res.status(200).send({ message: "Successfully" });
});

//stort4
exports.changeAccoutnInfomation = tryCatchBlockWithValidate(userSchema, async (req, res, next) => {
  const isOwner = req.params.userId === req.userData.id;
  if (!isOwner) {
    return next(new HttpError("TOKEN_ACCESS_DENIED", 403));
  }

  const updateData = req.body;
  const user = await User.findByIdAndUpdate(req.params.userId, updateData);
  if (!user) {
    return next(new HttpError("USER_NOTFOUND", 404));
  }

  return res.status(200).send({ message: "Successfully" });
});

//story5
exports.getAllAccounts = async (req, res, next) => {
  try {
    const userList = await User.find({});

    const minimizedUserList = userList.map((user) => minimizeUser(user));

    return res.status(200).send({ data: minimizedUserList });
  } catch (error) {
    next(error);
  }
};

//story6
exports.getAccountInfoById = tryCatchBlockWithValidate(null, async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new HttpError("USER_NOTFOUND", 404));
  }

  return res.status(200).send({ data: minimizeUser(user) });
});

//story7
exports.signUp = tryCatchBlockWithValidate(singUpInfoSchema, async (req, res, next) => {
  const userData = req.body;
  userData.password = encryptByMd5(userData.password);

  const user = new User(userData);

  const usernameIsExisted = await User.findOne({ username: user.username });
  if (usernameIsExisted) {
    return next(new HttpError("USER_EXISTED_USERNAME", 409));
  }

  await user.save();

  res.status(200).send({ message: "successfully" });
});
