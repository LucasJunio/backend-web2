const mongoose = require('mongoose');
let db;

module.exports = function() {
	if(!db){
		db = mongoose.connect('mongodb://localhost/web2')
	}
	return db;
}