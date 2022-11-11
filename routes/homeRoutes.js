//Imports
const express = require("express");
const auth = require("../controllers/authMiddleware");

//Import route functions
const router = express.Router();
const {
  getGames,
  // searchGame,
  // logout,
  // getGame
} = require("../controllers/homeController");

// //Route config
router.route("/").get( getGames);
// router.route("/search").post(auth,searchGame);
// router.route("/logout").get(auth,logout);
// router.route("/game/:id").get(auth, getGame)

module.exports = router;
