const jwt = require("jwt-simple");

const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  //sub is a jwt standard property (subject)
  //the subject of the token is user.id
  const timestamp = new Date().getTime();
  console.log(user.id);
  //iat = issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function (req, res, next) {
  const newEmail = req.body.email;
  const newPassword = req.body.password;

  //See if a user with the given email exists
  User.findOne({ email: newEmail }, async (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) return res.status(422).send({ error: "Email is in use" });

    //Create a user (adds it to the collection in the process)
    try {
      const newUser = await User.create({
        email: newEmail,
        password: newPassword,
      });
      res.send({
        success: true,
        token: tokenForUser(newUser),
        msg: `User added with email ${newUser.email}`,
      });
    } catch (error) {
      console.log("ERROR", error);
      res.status(400).json(error);
    }

    //respond to request indicating the state of the user creation
    // res.send({ success: "true", msg: `Email ${newUser.email} added` });
    //can also do the following:
    // res.status(200).json({ success: "true", msg: `Email ${newUser.email} added` })
  });
};

exports.signIn = function (req, res, next) {
  //email and pw are already authenticated (via the local strategy in passport.js)
  //need to spit out a token
  res.send({ token: tokenForUser(req.user) });
};
