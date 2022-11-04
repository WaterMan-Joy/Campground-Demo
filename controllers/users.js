const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "회원가입을 축하드립니다");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", "회원 가입에 실패하였습니다");
    res.redirect("/register");
  }
};

module.exports.logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      req.flash("error", "로그인에 실패하였습니다");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "로그아웃 되었습니다");
    res.redirect("/login");
  });
};

module.exports.login = (req, res) => {
  req.flash("success", "로그인 되었습니다");
  res.redirect("/campgrounds");
};
