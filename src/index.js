const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const postRouter = require('./routes/posts');

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
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postRouter);

app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
