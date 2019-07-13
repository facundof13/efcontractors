var express = require("express");
var router = express.Router();
const passport = require("passport");
var services = require("../models/services.js");
var testimonials = require("../models/testimonials.js");
var users = require("../models/users");
var projects = require("../models/projects");

router.use(function(req, res, next) {
  console.log(req.user);
  next();
});

router.post(
  "/login",
  function(req, res, next) {
    // console.log('routes/user.js, login, req.body: ');
    // console.log(req.body)
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    // console.log('logged in', req.user);
    var userInfo = {
      username: req.user.username
    };
    res.end();
  }
);

router.get("/logout", function(req, res, next) {
  // console.log('Server logging out!');
  req.logout();
  res.json("Ok");
});
router.get("/services", async function(req, res, next) {
  const serv = await services.getAllServices();
  res.json(serv);
});

router.get("/testimonials", async function(req, res, next) {
  const tests = await testimonials.getAllVerifiedTestimonials();
  res.json(tests);
});

//add testimonial
router.post("/testimonials/add/:text/:name/:citystate", async function(
  req,
  res,
  next
) {
  const params = req.params;
  const query = {
    Text: params.text,
    Name: params.name,
    CityState: params.citystate,
    InsertedDate: new Date().toISOString().split("T")[0],
    Verified: true
  };

  testimonials.addTestimonial(query);

  res.end();
});

// router.get('/login', function (req, res, next) {
//   res.render('login', {
//     title: 'Login',
//     user: req.user
//   });
// });

router.post("/register/:user/:pass", function(req, res, next) {
  const user = req.params.user;
  const pass = req.params.pass;

  query = {
    username: user,
    password: pass
  };
  users.createUser(query);
  res.end();
});

router.get("/user", (req, res, next) => {
  // console.log('===== user!!======')
  // console.log(req.user)
  // if (req.user) {
  //     res.json({ user: req.user })
  // } else {
  //     res.json({ user: null })
  // }
  res.json(req.user);
});

router.get("/users/username/:username", function(req, res, next) {
  const user = req.params.username;

  users.getUserByUsername(user);
  res.end();
});

router.get("/users/id/:id", function(req, res, next) {
  const id = req.params.id;

  users.getUserById(id);
  res.end();
});

// router.post('/login',
//   passport.authenticate('local', {
//     successRedirect: '/admin',
//     failureRedirect: '/login'
//   }));

router.get("/projects", async function(req, res, next) {
  res.json(await projects.getAllProjects());
});

module.exports = router;
