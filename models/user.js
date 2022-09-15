const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

//Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
});

//right before the save hook, encrypt password
userSchema.pre("save", function (next) {
  //get access to the user model
  const user = this;

  //generate the salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    //encrypt (hash) the password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      //overwrite plain pw with encrypted one
      user.password = hash;
    });
  });
  next();
});

//checks to see if candidatePassword and our stored PW are the same
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    //callback is the next function (the one listed in passport.js:26-30)
    // that has isMatch as a function parameter
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

//Create the model class and export
module.exports = mongoose.model("user", userSchema);
