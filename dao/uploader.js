const multer = require('multer');
const uploadsDir = './public/uploads'
const storage = multer.diskStorage({
	destination: function(rq, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function(req, file, cb) {
		let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
		cb(null, req.session.user.name + '_' + file.originalname.split('.')[0] + Date.now() + '.' + ext);
	}
});
const uploader = multer({storage: storage});
module.exports = uploader;
module.exports.storage = storage;