import { User } from "../models/user.models.js";
import { apierror } from "../utilities/apierror.js";
import { apiresponse } from "../utilities/apiresponse.js";
import { asynchandler } from "../utilities/asynchandler.js";

const updateScore = asynchandler(async (req, res) => {
  const { score } = req.body;
  const user_req = req.user;
  if (!user_req) {
    throw new apierror(400, "couldn't get any user...");
  }
  const user = await User.findById(user_req._id);
  const updateScore = await user.updateOne({ score: score });

  res
    .status(200)
    .json(new apiresponse(200, user, "user score has been updated"));
});

const allScore = asynchandler(async (req, res) => {
  const user = await User.find();
  res.status(200).json(new apiresponse(200, user, "user details"));
});

const getScore = asynchandler(async (req, res) => {
  const user = req.user;
  const mainUser = await User.findById(user._id);
  res
    .status(200)
    .json(
      new apiresponse(200, mainUser.score, "the new score of the user is this ")
    );
});
export { updateScore, allScore,getScore };
