const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./database');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const postRouter = require('./routes/posts');

dotenv.config();

connectDB();

const app = express();
const port = parseInt(process.env.PORT) || 3000;
const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postRouter);

app.get('/', (_req, res) => {
  res.send('hello world');
});

function runServer() {
  return app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
  );
}

//In testing environment (NODE_ENV=test), server will run from inside tests.
if (process.env.NODE_ENV !== 'test') {
  runServer();
}

module.exports = runServer;
