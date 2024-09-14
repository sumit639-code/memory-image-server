import { User } from "../models/user.models.js";
import { apierror } from "../utilities/apierror.js";
import { asynchandler } from "../utilities/asynchandler.js";
import { apiresponse } from "../utilities/apiresponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    console.log(accessToken);

    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error, "error while creating accessToken & refreshToken");
  }
};

const userRegister = asynchandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new apierror(400, "username and password feilds are required");
  }
  const existedUser = await User.findOne({ username });
  if (existedUser) {
    throw new apierror(302, "user already existed");
  }
  if (password.length <= 4) {
    throw new apierror(304, "password length should be more.");
  }

  const createUser = await User.create({
    username: username,
    password: password,
  });
  if (!createUser) {
    throw new apierror(400, "there is some error while saving the data.");
  }

  const createdUser = await User.findById(createUser._id).select(
    "-password  -refreshToken"
  );
  return res
    .status(200)
    .json(new apiresponse(200, createdUser, "user has been created."));
});

const userLogin = asynchandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new apierror(404, "Email and password fields can't be empty.");
  }

  const getUser = await User.findOne({ username });
  if (!getUser) {
    throw new apierror(404, "User is not registered.", [getUser]);
  }

  const passValid = await getUser.isPasswordCorrect(password);
  if (!passValid) {
    throw new apierror(401, "Invalid password.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    getUser._id
  );
  console.log(accessToken, refreshToken);

  const createdUser = await User.findById(getUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag based on environment
    sameSite: "strict", // Optionally, add sameSite attribute for additional security
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiresponse(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User is logged in."
      )
    );
});

const userLogout = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apierror(300, "there is some error getting the user");
  }
  const remRefresh = await User.findByIdAndUpdate(user._id, {
    refreshToken: "",
  });
  const options = {
    httpsOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiresponse(200, "user has been successfully logout"));
});

export { userLogin, userRegister, userLogout };
