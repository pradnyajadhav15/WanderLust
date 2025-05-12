const User = require("../models/user.js");

module.exports.signupRender = (req, res) => {
  res.render("users/signup.ejs", { page: "signup" });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    let newUser = new User({
      username,
      email,
    });

    let registerUser = await User.register(newUser, password);

    //this is passport fucntion for when user signup then automatically logged in..it's take 2 argument first is user info and then call back
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!!");
      res.redirect("/");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.loginRender = (req, res) => {
  res.render("users/login.ejs", { page: "login" });
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to WanderNest!!  You are logged in!");
  //user login thase pachi apde aene redirectUrl par pacha redirect karsu means je route par thi te login par aya ta tya j pacha after login aene redirect karvama avse burt haji ama problem che k if user firect login btn click karine login page ma ave without any route to req.session.redirectUrl aa valur undefine hase so aene as it is "/listings" par redirect kari devanu;

  // console.log(req.session.redirectUrl); // it's give undefine bcs passport clear session after user login so we use middleware to store this value in res.locals.redirectUrl .

  // console.log(res.locals.redirectUrl); //value of redirectUrl

  const finalUrl = res.locals.redirectUrl || "/";
  res.redirect(finalUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged Out!!");
    res.redirect("/");
  });
};