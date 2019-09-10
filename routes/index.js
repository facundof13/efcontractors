var express = require("express");
var router = express.Router();
const passport = require("passport");
var services = require("../models/services.js");
var testimonials = require("../models/testimonials.js");
var users = require("../models/users");
var projects = require("../models/projects");

router.use(function(req, res, next) {
  next();
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'react-ui/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'react-ui/build', 'index.html'));
  });
}


router.post(
  "/login",
  function(req, res, next) {
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
router.post("/testimonials", function(req, res, next) {
  const query = {
    text: req.body.text,
    name: req.body.name,
    cityState: req.body.cityState,
    insertedDate: new Date().toISOString().split("T")[0],
    verified: false
  };

  testimonials.addTestimonial(query);

  res.end();
});

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

router.get("/projects", async function(req, res, next) {
  res.json(await projects.getAllProjects());
});

module.exports = router;
