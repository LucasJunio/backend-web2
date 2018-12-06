const express = require('express');
const router = express.Router();
const User = require('../model/user');

// Realiza o cadastro de usuarios
router.post('/register', (req, res) => {
	console.log('received');
	let email = req.body.email;
	let name = req.body.name;
	let password = req.body.password;
	// let password2 = req.body.password2;

	req.checkBody('email', 'E-mail inválido ou mal formatado.').isEmail();
	req.checkBody('name', 'Nome requer 3 letras ou mais.').isLength({ min: 3});
	req.checkBody('password', 'Senha requer 6 dígitos ou mais.').isLength({ min: 6 });
	// req.checkBody('password2', 'Senhas não são iguais').equals(password);
	let erros = req.validationErrors();

	if(erros) {
		req.session.errors = erros;
		req.session.success = false;
		console.log(erros);
		return res.send({ errors: erros});
	}
	else{
		req.session.success = true;
		
		let newUser = new User({
			name: name,
			email: email,
			password: password
		});

		User.createUser(newUser, (err, savedUser) => {
			if(err){
				// res.render('cadastro', {unique_email: 'E-mail já em uso.'});
				return res.send({ success: false, message: 'E-mail já em uso.' });
			}
			else {
				return res.send({ success: true, message: 'Usuário registrado!' });
				// res.redirect('/login');
			}
		});
	}
});

module.exports = router;