const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const users = require("../controllers/users");

const catchAsync = require("../utils/catchAsync");

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    users.login
  );

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register))
  .get(users.renderRegister);

router.get("/logout", catchAsync(users.logout));

module.exports = router;
