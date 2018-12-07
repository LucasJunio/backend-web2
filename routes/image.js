const routes = require('express').Router();
const User = require('../model/user');
const uploader = require('../dao/uploader');
const files = require('../dao/files');
var multer = require('multer');

const ImgurStorage = require('multer-storage-imgur');

// Setting
//imgur.setClientId('a7db86935be50db');
//imgur.setAPIUrl('https://api.imgur.com/3/');

routes.get('/', async (req, res) => {
	let images = await User.findOne({ _id: req.session.user._id })

	if (req.query.q) {
		let query = req.query.q;

		res.send({
			images: images.images.filter(el => el.filename.includes(query))
		});
	} else {
		res.send({
			images: images.images
		});
	}
});

routes.post('/', (req, res) => {
/*	imgur.uploadFile(req.body.myImage)
    .then(async function (json) {
        console.log(json.data.link);
		console.log("File uploaded");
		let user = await User.findOne({ _id: req.session.user._id })
		user.images.push({ filename: json.data.link })
		user.save()

		console.log(req.file.filename)
		res.send({ success: true, msg: 'File is uploaded' })
	})
    .catch(function (err) {
        console.error(err.message);
		res.send({ error: 'error while trying to upload file to imgur' })
    });*/
	var upload = multer({
		storage: ImgurStorage({ clientId: 'a7db86935be50db' }),
		fileFilter: function (req, file, callback) {
			let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
			if (ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg') {
				console.log(ext)
			}
			callback(null, true)
		}
	}).single('myImage');
	upload(req, res, async function (err) {
		if (err) {
			console.log(err)
			res.send({ error: 'error while trying to upload file' })
		} else {
			console.log("File uploaded");
			let user = await User.findOne({ _id: req.session.user._id })
			user.images.push({ filename: req.file.data.link })
			user.save()

			console.log(req.file.data.link)
			res.send({ success: true, msg: 'File is uploaded' })
		}
	})
})


module.exports = routes;