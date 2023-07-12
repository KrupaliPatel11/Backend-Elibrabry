/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require('uuid-random');

module.exports = {
  // User Signup
  userSignup: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please in the required field" });
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already in use" });
    }
    const hash = await bcrypt.hash(password[0], 10, async (err, hash) => {
      if (err) {
        throw err
      } else {
        const createdUser = await User.create({ id: uuid(), name: name, email: email, password: hash });
        return res.status(201).json({ success: true, msg: "User Created" });
      }
    });
  },

  //   User Login
  userLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res.status(400).json("not found")
    }

    const user = await User.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Enter Valid Credential" });
    }
    const matchPass = await bcrypt.compare(password, user.password);
    console.log(password, user.password)
    if (!matchPass) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Enter Valid Credentials" });
    }
    const genToken = await jwt.sign({ id: user.id, role: user.role },
      // process.env.JWY_KEY,
      "krupali11",
      {
        expiresIn: "3d",
      });
    if (!genToken) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    const token = await User.update({ id: user.id }).set({ token: genToken });
    return res.status(200).json({ success: true, token: genToken });
  },

  adminLogin: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Enter Valid Credential" });
    }
    console.log(sails.config.enum.role.ADMIN)
    if (user.role !== sails.config.enum.role.ADMIN) {
      return res.status(403).json({ success: false, msg: "You are not allow to access this resource" });
    }
    const matchPass = await bcrypt.compare(password, user.password);
    console.log(matchPass)
    if (!matchPass) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Enter Valid Credentials" });
    }
    const genToken = await jwt.sign({ id: user.id, role: user.role }, "krupali11", {
      expiresIn: "3d",
    });
    if (!genToken) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    const token = await User.update({ id: user.id }).set({ token: genToken });
    return res.status(200).json({ success: true, token: genToken });
  },

  //   User Logout
  userLogout: async (req, res) => {
    const { id } = req.userData;
    let user = await User.findOne({ id: id });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    user = await User.update({ id: id }).set({ token: "" });
    return res.status(200).json({ success: true, msg: "User Logout" });
  },

  // Admin logout
  adminLogout: async (req, res) => {
    const { id } = req.userData;
    let admin = await User.findOne({ id: id });
    if (!admin) {
      return res
        .status(500)
        .json({ success: false, msg: "Something Went Wrong" });
    }
    updateAdmin = await User.update({ id: id }).set({ token: "" });
    return res.status(200).json({ success: true, msg: "Admin Logout" });
  },

  // All Book By user
    gelAllBook: async (req, res) => {
      const book = await Book.find();
      if (book.length <= 0) {
        return res.status(404).json({ success: false, msg: "Not Any Book" });
      } else {
        return res.status(200).json({ success: true, msg: "Books", books: book });
      }
    },


//   gelAllBook: async (req, res) => {

//     let queryParams = {},
//       pageNum = req.query.pageNum || 1,
//       limit = req.query.pageSize || 10;
//       await Book.count(queryParams).then(async (_count) => {
//       console.log(_count)
//       const book = await Book.find(queryParams).paginate(pageNum, limit)
//       return {
//         count: book.length,
//         book: book
//       }
//     }).then(res.ok)
//       .catch(err => res.negotiate(err, message));

//   }

};

