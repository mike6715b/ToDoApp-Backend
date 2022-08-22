import User from "../models/user.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static login = async (req, res) => {
    let { username, password } = req.body;

    //Check if email and password are sent
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    //Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "User does not exist",
      });
    }

    //Check if password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        error: "Incorrect username or password",
      });
    }

    //Generate JWT
    const { sign } = jwt;
    const token = sign(
      {
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //Send response
    return res.status(201).json({
      message: "Logged in successfully",
      token,
    });
  };

  static register = async (req, res) => {
    let { username, password } = req.body;

    //Check if email and password are sent
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    //Check if email is unique
    if (await User.findOne({ username })) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    //Hash password before saving
    password = await bcrypt.hash(password, 10);

    //Create new user
    const user = new User({
      username,
      password,
    });

    //Save user to database
    await user.save();

    //Generate JWT
    const { sign } = jwt;
    const token = sign(
      {
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //Send response
    return res.status(201).json({
      message: "User created successfully",
      token,
    });
  };
}

export default AuthController;
