
const fs = require('fs');

module.exports.readImgsByUser = function(uploadsDir, cb) {
	fs.readdir(uploadsDir, cb);
}