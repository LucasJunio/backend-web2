const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.get('/logout', async (req, res) => {
	req.session.destroy()
	res.send({logged: false})
})

router.post('/login', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	req.checkBody('email', 'E-mail inválido ou mal formatado.').isEmail();
	req.checkBody('password', 'Senha requer 6 dígitos ou mais.').isLength({ min: 6 });
	let erros = req.validationErrors();

	if (erros) {
		req.session.errors = erros;
		req.session.success = false;
		req.session.save()
		console.log(erros);
		return res.send({ error: 'E-mail/Senha inválidos ou não cadastrados.' });
	}

	User.getUserByEmail(email, (err, user) => {
		console.log(JSON.stringify(user));
		User.comparePassword(password, (user) ? user.password : '', (err, isMatch) => {
			console.log(err);
			console.log(isMatch)
			if (err || !user || !isMatch) {
				console.log(err);
				res.send({ error: 'E-mail/Senha inválidos ou não cadastrados.' });
			}
			else {
				console.log(user)
				req.session.user = user;
				req.session.userid = user._id;
				//				req.session.save()
				console.log('\n req session')
				console.log(req.session)
				res.send({ success: true });
			}
		});
	});
});

module.exports = router;