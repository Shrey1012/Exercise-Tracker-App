const router = require("express").Router();
const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    height: req.body.height,
    weight: req.body.weight,
    age: req.body.age,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("Wrong credentials!");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      res.status(401).json("Wrong credentials!");
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  localStorage.removeItem("persist:root");
});

module.exports = router;
