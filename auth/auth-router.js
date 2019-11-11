const router = require('express').Router();

const Users = require('../users/users-model.js');

const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
	let user = req.body;

	Users.add(user)
		.then(saved => {
			res.status(201).json(saved);
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user) {
				res.status(200).json({ message: `Welcome ${user.username}!` });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.post('/hash', (req, res) => {
	let user = req.body;
	const { password } = req.body;

	const hash = bcrypt.hashSync(user.password, 12);

	user.password = hash;

	console.log(user.password);

	Users.add(user)
		.then(uInfo => {
			console.log(uInfo);
			res.status(201).json({ password: password, hash: user.password });
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

module.exports = router;
