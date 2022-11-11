//Imports
const {User} = require("../models/models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

//Route functions 
exports.registerUser = async (req, res, next) => {
  try {
    const pass = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    let user = {
      username: req.body.username,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      profile_pic: "",
      cover_pic: "",
      role: req.body.role,
      following_list: [],
      followers_list: [],
      followers_count: 0,
      following_count: 0,
    };
    //Db save
    
    user = await User.create(user);
   

    jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          //Response
          return res.json({ err: err });
        } //TODO can remove jwt from registeration
        return res.json({
          msg: "User created",
          user: user,
          token
        });
      }
    );
  } catch (err) {
    return res.json({
      err: err.stack
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    let user = await userModel.findOne({ username: req.body.username }).then(
      user => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then(match =>
            match
              ? jwt.sign(
                  { id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: '360d' },
                  (err, token) => {
                    if (err) {
                      return res.json({ err: err });
                    }
                    return res.json({
                      msg: "User Logged",
                      token,
                      logged: true,
                      fn:user.firstname
                    });
                  }
                )
              : res.json({ msg: "Wrong password", logged: false })
          );
        } else {
          return res.json({ msg: "Username does not exist", logged: false });
        }
      }
    );
  } catch (err) {
    return res.json({
      err: err
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.uid }).then(
      user => {
        if (user) {
          res.json({ msg: "Username does not exist", user });
        } else {
          return res.json({ msg: "Username does not exist", logged: false });
        }
      }
    );
  } catch (err) {
    return res.json({
      err: err.stack
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.uid,req.body).then(
      user => {
        if (user) {
          res.json({ updated: true,msg: "User updated"});
        } else {
          return res.json({ updated: false,msg: "Username does not exist" });
        }
      }
    );
  } catch (err) {
    return res.json({
      err: err.stack
    });
  }
}