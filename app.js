// 프로덕션 모드가 아닌 개발 단계에서는 env 파일이 사라진다
// 명령어 - NODE_ENV=production node app.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// 당장 이것을 쓰면 (에러 정보가 유저에게 나타나지 않는다)
// require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const ExpressError = require("./utils/ExpressError");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");

const app = express();

const dbUrl = "mongodb://localhost:27017/testcamp";
const myDBUrl = process.env.DB_URL;
const secret = process.env.SECRET || "isthiswatermankey";

main()
  .then((res) => {
    console.log("MONGOOSE CONECT!");
  })
  .catch((err) => console.log(err));

async function main() {
  // "mongodb://localhost:27017/testcamp"
  await mongoose.connect(myDBUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(mongoSanitize());

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 14 * 24 * 60 * 60,
  //   ttl: 14 * 24 * 60 * 60, // = 14 days. Default
});

store.on("error", function (err) {
  console.log("SESSION STORE ERR", err);
});

app.use(
  session({
    store: store,
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      //   secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
// app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session);
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);
app.use(express.static(path.join(__dirname, "public")));

// TODO: GET
app.get("/", (req, res) => {
  res.render("home");
});

const handleError = (err) => {
  console.dir(err);
  return new ExpressError(
    `ERR NAME - ${err.name}, ERR MESSAGE - ${err.message}, ERR STATUS - ${err.status}, DEFAULT ERR STATUS - `,
    400
  );
};

// TODO: OTHER ERROR
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND!!", 404));
});

// TODO: ERROR
app.use((err, req, res, next) => {
  console.log("****************************************");
  console.log("*********************ERROR**************");
  console.log("****************************************");
  console.log(err.name);
  if (
    err.name === "Error" ||
    err.name === "CastError" ||
    err.name === "ValidationError"
  )
    err = handleError(err);
  const { status = 500, message = "SOMETHING WORNG!!" } = err;
  res.status(status).render("error", {
    status,
    message,
    err,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`SERVER ON PORT ${port}`);
});
