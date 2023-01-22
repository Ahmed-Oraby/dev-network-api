const mongoose = require('mongoose');

module.exports = function () {
	let dbURI = process.env.DB_URI;
	if (process.env.NODE_ENV === 'test') {
		dbURI = process.env.DB_URI_TEST;
	}

	mongoose
		.connect(dbURI)
		.then(() => console.log('Mongodb connected...'))
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});
};
