const User=require("../model/user.js")


module.exports.signUp=async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const register = await User.register(newUser, password);
      console.log(register);
      req.login(register, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "User registered successfully!");
        res.redirect("/listings");
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Invalid username or password!");
      res.redirect("/signup");
    }
  }

  module.exports.loginForm=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "yes !! you are succesfully logout");
    res.redirect("/listings");
  });}