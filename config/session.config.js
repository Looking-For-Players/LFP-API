const expressSession = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(expressSession);

const session = expressSession({
	secret: process.env.SESSION_SECRET,
	saveUninitialized: false,
	resave: false,
	cookie: {
		secure: process.env.SESSION_SECURE,
		sameSite: false,
		httpOnly: true,
		maxAge: Number(process.env.SESSION_MAX_AGE),
	},
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: Number(process.env.SESSION_MAX_AGE),
	}),
});

module.exports = session;
