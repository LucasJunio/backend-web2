const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const Imagem = require('./Imagem')

const userSchema = new mongoose.Schema({
	email: {
		type: String, 
		unique: true
	},
	name: {
		type: String
	},
	password: {
		type: String
	},
	images : [Imagem.schema]
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('users', userSchema);
module.exports = User;

module.exports.createUser = function(newUser, cb) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(cb);
		})
	});
}

module.exports.getUserByEmail = function(email, cb) {
	let query = {email: email};
	User.findOne(query, cb);
}

module.exports.getUserById = function(id, cb) {
	User.findById(id, cb);
}

module.exports.comparePassword = function(password, hash, cb) {
	bcrypt.compare(password, hash, function(err, isMatch) {
		if (err) throw err;
		cb(null, isMatch);
	});
}