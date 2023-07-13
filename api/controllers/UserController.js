/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require('uuid-random');
const validator = require('validator')

module.exports = {
  // User Signup
  userSignup: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please in the required field" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid Email Type" })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, msg: "Password should be 6 characters long" })
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already in use" });
    }
    // const hash = await bcrypt.hash(password, 10, async (err, hash) => {
    const hash = await bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw err;
      } else {
        const createdUser = await User.create({ id: uuid(), name: name, email: email, password: hash });
        return res.status(201).json({ success: true, msg: "User Created" });
      }
    });
  },

  //   User Login
  userLogin: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Email and Password are required")
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

  gelAllBook: async (req, res) => {
    // pagination
    let { page, limit} = req.query;
    page = parseInt(page);
    limit =parseInt(req.query.limit) ||  5;
    // let skip = 1;

    const totalBook = await Book.find();
    if (totalBook.length <= 0) {
      return res.status(404).json({ success: false, msg: "Not Any Book" });
    }


    if (page === 1) {
      var books = await Book.find({
        skip: 0,
        limit: limit,
        sort: 'createdAt'
      });
      return res.status(200).json({ success: true, totalBook: totalBook.length, count: books.length, books: books })
    } else {
      var books = await Book.find({
        skip: (limit * page) - limit,
        limit: limit,
        sort: 'createdAt'
      });
      return res.status(200).json({ success: true, totalBook: totalBook.length, count: books.length, books: books })

    }



  }
}

