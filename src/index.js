const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/users');

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT) || 3000;
const dbURI = process.env.DB_URI;

mongoose
	.connect(dbURI)
	.then(() => console.log('Mongodb connected...'))
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});

app.use(express.json());

app.use('/api/users', userRouter);

app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
