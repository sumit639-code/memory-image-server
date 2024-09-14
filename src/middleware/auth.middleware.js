import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { apierror } from "../utilities/apierror.js";
import { asynchandler } from "../utilities/asynchandler.js";

export const verifyJwt = asynchandler(async (req, res, next) => {
  try {
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
    
    if (!token) {
      throw new apierror(401, "User is not authorized");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      throw new apierror(401, "Token cannot be verified");
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in verifyJwt middleware:', error.message);
    next(new apierror(500, "There was an error while verifying JWT."));
  }
});
