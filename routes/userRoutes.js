//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
  // followUser,
  // getFollowers,
  // getFollowing,
} = require("../controllers/userController");

//Routes config
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile/:uid").get(getUser).post(auth, updateProfile);
// router.route("/profile/following/:uid").get(auth, getFollowing);
// router.route("/profile/follower/:uid").get(auth, getFollowers);
// router.route("/profile/follow/:uid").get(auth, followUser);

module.exports = router;
