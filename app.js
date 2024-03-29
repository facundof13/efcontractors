var express = require("express");
var app = express();
var mongoUtil = require("./mongoUtil");

mongoUtil.connectToServer((err, client) => {
  if (err) console.log(err);
  // ----- REST OF APP SETUP ------
  var createError = require("http-errors");
  // var path = require('path');
  var cookieParser = require("cookie-parser");
  var logger = require("morgan");
  var session = require("express-session");
  var passport = require("passport");
  var users = require("./models/users");
  const bodyParser = require("body-parser");
  var path = require("path");

  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  // app.use(logger("dev"));
  console.clear();
  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(cookieParser());
  app.use(
    session({
      secret: "secret",
      saveUninitialized: true,
      resave: true,
    })
  );
  app.use(express.static(path.join(__dirname, "react-ui/build")));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    users.getUserById(id, function (err, user) {
      done(err, user);
    });
  });
  // app.use(express.static(path.join(__dirname, 'public')));

  var uploadRouter = require("./routes/uploadRouter");
  var indexRouter = require("./routes/index");
  var adminRouter = require("./routes/admin");
  app.use("/", indexRouter);
  app.use("/admin", adminRouter);
  app.use("/upload", uploadRouter);

  app.get("/*", function (req, res) {
    res.sendFile(
      path.join(__dirname, "react-ui/build/index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
  var localStrategy = require("passport-local").Strategy;
  passport.use(
    new localStrategy(function (username, password, done) {
      users.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, {
            message: "Unknown User",
          });
        }
        users.comparePassword(password, user.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Invalid password",
            });
          }
        });
      });
    })
  );

  // catch 404 and forward to error handler
  // app.use(function (req, res, next) {
  //   next(createError(404));
  // });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("error");
  });

  // ----- FINISH REST OF APP SETUP ------
});

module.exports = app;
