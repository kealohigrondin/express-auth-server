const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//Create local strategy
//purpose of localstrategy is to verify email/pw then spit out a token to authorize
// future requests after logging in
//the process of creating a token on signin is what goes on behind the scenes to actually
// log someone in
const localOptions = { usernameField: "email" };
//usernameField is assigned the value of the inputted email
const localSignIn = new LocalStrategy(
  localOptions,
  (submittedEmail, submittedPassword, done) => {
    //verify the user/pw, call done with the user
    //if it's the right user/pw
    //otherwise call done with false
    User.findOne({ email: submittedEmail }, function (err, user) {
      console.log("from localSignIn");
      if (err) return done(err); //error
      if (!user) return done(null, false); //email doesn't exist in db

      //verify the PW is correct (encrypt submittedPW and compare against db)
      user.comparePassword(submittedPassword, function (err, isMatch) {
        if (err) return done(err);
        if (!isMatch) return done(null, false);
        return done(null, user);
        //assigns user to req.user so we can see it in the following
        // function call (authentication.js.signIn in this case)
      });
    });
  }
);

//Setup options for JWT strategy
const jwtOptions = {
  //extract the value from the header called 'authorization' and put into jwtFromRequest variable
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  //get the secret for decrypting the jwt token
  secretOrKey: config.secret,
};

//Create JWT strategy
const jwtSignIn = new JwtStrategy(jwtOptions, (payload, done) => {
  //payload is decoded jwt token {sub, iat} that we set in signup
  //done is a callback

  //See if the user ID in the payload exists in our DB
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false); //false is where we would put user

    //if so, call 'done' with the user
    //else call 'done' w/o a user object
    if (user) done(null, user);
    else done(null, false);
  });
});

//Tell passport to use the strategy
passport.use(localSignIn);
passport.use(jwtSignIn);
