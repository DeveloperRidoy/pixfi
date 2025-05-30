import User from "@/mongoose/models/User";
import AppError from "@/lib/server/AppError";
import catchAsync from "@/lib/server/catchAsync";
import connectDB from "@/lib/server/connectDB";
import isEmail from "@/lib/isEmail";
import AppResponse from "@/lib/server/AppResponse";
import { parseJson } from "@/lib/server/reqParser";
import { setAuthCookie } from "@/lib/server/cookieHandler";
import { EUserRole, IUser } from "@/types/user.types";

// register user
export const POST = catchAsync(async (req) => {
  // get data from body
  const { name, email, password, confirmPassword, interestedCategories } =
    await parseJson(req);

  // check data
  if (!name) throw new AppError(400, "name is required");
  if (!email) throw new AppError(400, "email is required");
  if (!isEmail(email)) throw new AppError(400, "not a valid email");
  if (!password) throw new AppError(400, "password is required");
  if (!confirmPassword) throw new AppError(400, "confirm password is required");
  if (password !== confirmPassword)
    throw new AppError(400, "passwords don't match");

  // connect to database
  await connectDB();

  // // check if user already exists
  const user = await User.findOne({ email }).select("+password");
  if (user) throw new AppError(404, "user with email already exists");

  // // create user
  const newUser = await User.create({
    name,
    email,
    password,
    role: EUserRole.USER,
    interestedCategories,
  });

  // // set auth cookie with user's id
  await setAuthCookie(newUser._id.toString());

  // // remove password for safety
  const userData: IUser = newUser;
  userData.password = undefined;

  // // send response
  return new AppResponse(200, "registration successful", { doc: userData });
});
