const {userModel} = require("../models/models.js");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

exports.getGames = async (req, res, next) => {
    try {
      
      //response
      return res.status(200).json({
        success: true,
        worked:true
      });
      //user_todos
    } catch (error) {
      //error response
      return res.status(500).json({
        success: false,
        err: error
      });
    }
  };
  