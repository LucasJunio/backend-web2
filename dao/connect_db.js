const mongoose = require('mongoose');
let db;

module.exports = function() {
	if(!db){
		db = mongoose.connect('mongodb://junio:lucas123456@ds127644.mlab.com:27644/web2')
	}
	return db;
}