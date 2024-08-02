const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const auth = require("../auth.js");
const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ message: "Email Invalid" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password must be atleast 8 characters" });
  } else {
    let newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((result) =>
        res.status(201).send({ message: "Registered Successfully" })
      )
      .catch((error) => errorHandler(error, req, res));
  }
};

module.exports.loginUser = (req, res) => {
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Invalid Email" });
      } else if (result == null) {
        return res.send({ error: "No Email Found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        if (isPasswordCorrect) {
          return res.send({ access: auth.createAccessToken(result) });
        } else {
          return res.send({ error: "Email and password do not match" });
        }
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.showUserDetails = (req, res) => {
  const userId = req.user.id;

  return User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(404).send({ error: 'User not found' });
      }
      user.password = undefined;
      return res.status(200).send({ user });
    })
    .catch(err => res.status(500).send({ error: 'Failed to fetch user profile', details: err }));
};
