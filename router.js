const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

//intercepts requests and passes them thru the jwt or local strategies
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  //expecting a get request to '/'
  app.get("/", requireAuth, function (req, res) {
    res.send({ success: "hello" });
  });
  
  app.post("/signup", Authentication.signup);

  //requireLogin is another "middleware" type function that applies the local strategy
  // from passport.js
  app.post("/login", requireLogin, Authentication.login);

};
