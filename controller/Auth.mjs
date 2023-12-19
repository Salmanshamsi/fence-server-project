import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "../config/index.mjs";
import User from "../modal/User.mjs";



const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY);
      res.status(200).json({ status: "ok", data: token });
    } else {
      res.status(401).json({ status: "error", error: "Invalid Password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createUser, loginUser};