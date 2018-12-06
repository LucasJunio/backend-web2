const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const validator = require('express-validator');
const mongoose = require('mongoose');

mongoose.connect('mongodb://junio:lucas123456@ds127644.mlab.com:27644/web2');

const imageRoutes = require('./routes/image');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();
global.uploadsDir = 'public/uploads';
var cors = require('cors');

app.use(cors({
	origin: 'https://frontend-web2.herokuapp.com',
	credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.set('trust proxy', 1) // trust first proxy

app.use(session({
	httpOnly: false,
	secure: false,
	secret: 'kasdw', saveUninitialized: false, resave: false,
	unset: 'destroy',
	cookie: { secure: false, maxAge: 600000 }
}));

const sessionChecker = (req, res, next) => {
	let text = '';
	text += JSON.stringify(req.cookies)
	let session = JSON.stringify(req.session)
	if (!req.session.user || !req.session.user._id) {
		res.send({ status: 'not authorized', text: text, session: session, user: req.session.user });
	} else {
		next();
	}
}

app.use('/public', express.static(__dirname + '/public/'));
app.use('/image', sessionChecker, imageRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/', express.static(__dirname + '/public/build/'));

app.listen(3001, function () {
	console.log('Server running at http://localhost:3001');
});
