import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sendUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: makeToken(user._id),
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });

    // Pehlo user admin banse, baki badha user
    const role = (await User.countDocuments()) === 0 ? "admin" : "user";
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json(sendUser(user));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Wrong email or password" });

    res.json(sendUser(user));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
