var express = require('express');
var router = express.Router();
const passport = require('passport');
var services = require('../models/services.js');
var testimonials = require('../models/testimonials.js');
var users = require('../models/users');
var projects = require('../models/projects');

router.use(function(req, res, next) {
	next();
});

router.post(
	'/api/login',
	function(req, res, next) {
		next();
	},
	passport.authenticate('local'),
	(req, res) => {
		// console.log('logged in', req.user);
		var userInfo = {
			username: req.user.username
		};
		res.end();
	}
);

router.get('/api/logout', function(req, res, next) {
	// console.log('Server logging out!');
	req.logout();
	res.json('Ok');
});
router.get('/api/services', async function(req, res, next) {
	const serv = await services.getAllServices();
	res.json(serv);
});

router.get('/api/testimonials', async function(req, res, next) {
	const tests = await testimonials.getAllVerifiedTestimonials();
	res.json(tests);
});

//add testimonial
router.post('/api/testimonials', function(req, res, next) {
	const query = {
		text: req.body.text,
		name: req.body.name,
		cityState: req.body.cityState,
		insertedDate: new Date().toISOString().split('T')[0],
		verified: false
	};

	testimonials.addTestimonial(query);

	res.end();
});

router.post('/api/register/:user/:pass', function(req, res, next) {
	const user = req.params.user;
	const pass = req.params.pass;

	query = {
		username: user,
		password: pass
	};
	users.createUser(query);
	res.end();
});

router.get('/api/user', (req, res, next) => {
	res.json(req.user);
});

router.get('/api/users/username/:username', function(req, res, next) {
	const user = req.params.username;

	users.getUserByUsername(user);
	res.end();
});

router.get('/api/users/id/:id', function(req, res, next) {
	const id = req.params.id;

	users.getUserById(id);
	res.end();
});

router.get('/api/projects', async function(req, res, next) {
	res.json(await projects.getAllProjects());
});

// router.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/../react-ui/build/index.html'));
// });

module.exports = router;
