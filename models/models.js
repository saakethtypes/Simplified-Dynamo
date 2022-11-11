var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fuser = new Schema({
  profilepic: {
    data: Buffer,
    contentType: String,
  },
  fname: String,
  lname: String,
  username: {
    type: String,
    ref: "userModel",
  },
  role: {
    type: String,
    required: true,
  },
});

var review = new Schema({
  profilepic: {
    data: Buffer,
    contentType: String,
  },
  fname: String,
  lname: String,
  username: {
    type: String,
    ref: "userModel",
  },
  role: {
    type: String,
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
  },
  dateOfReview: { type: Date, default: () => Date.now() },
});

var userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true, // `email` must be unique
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  profile_pic: {
    data: Buffer,
    contentType: String,
  },
  cover_pic: {
    data: Buffer,
    contentType: String,
  },
  role: {
    type: String,
    required: true,
  },
  doj: { type: Date, default: () => Date.now(), immutable: true },
  following_list: [fuser],
  followers_list: [fuser],
  following_count: Number,
  followers_count: Number,
});

var detailsSchema = new Schema({
  gameslug: {
    type: String,
    unique: true,
    required: true,
  },
  likes: [fuser],
  reviews: [review],
});

var favritesSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    ref: "userModel",
  },
  gameslug: {
    type: String,
    required: true,
  },
  gamename: {
    type: String,
    required: true,
  },
  gameImage: {
    data: Buffer,
    contentType: String,
  },
});

var activitySchema = new Schema({
  username: {
    type: String,
    required: true,
    ref: "userModel",
  },
  gameslug: {
    type: String,
    required: true,
  },
  gamename: {
    type: String,
    required: true,
  },
  gameImage: {
    data: Buffer,
    contentType: String,
  },
  liked: Boolean,
  review: String,
  rating: Number,
});

const User  = mongoose.model("User", userSchema);
const Game = mongoose.model("Game", detailsSchema);
const Activity = mongoose.model("Activity", activitySchema);
const Favorite = mongoose.model("Favorite", favritesSchema);
const Review = mongoose.model("Review", review);
const UserInfo = mongoose.model("UserInfo", fuser);
module.exports = {
  User,
  Game,
  Activity,
  Favorite,
  Review,
  UserInfo,
};
