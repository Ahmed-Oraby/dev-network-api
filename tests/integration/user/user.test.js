const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const runServer = require('../../../src/index');
const User = require('../../../src/models/User');

let server;
const secret = process.env.JWT_SECRET;

describe('Users endpoint: /api/users', () => {
	beforeAll(() => {
		console.log = jest.fn();
		server = runServer();
	});

	afterAll(async () => {
		await User.collection.drop();
		await mongoose.connection.close();
		server.close();
	});

	describe('POST /register', () => {
		const user = {
			name: 'ahmed',
			email: 'any@any.com',
			password: '12345',
		};

		it('should return the jwt token for the registered user', async () => {
			const response = await request(server).post('/api/users/register').send(user);

			const decoded = jwt.verify(response.body.token, secret);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('token');
			expect(decoded.user).toHaveProperty('id');
		});

		it('should return 400 if user is already registered', async () => {
			const response = await request(server).post('/api/users/register').send(user);
			expect(response.status).toBe(400);
		});
	});

	describe('POST /login', () => {
		it('should return 403 if user is not registered', async () => {
			const response = await request(server)
				.post('/api/users/login')
				.send({ email: 'invalid@any.com', password: '12345' });
			expect(response.status).toBe(403);
		});

		it('should return 403 if user is registered but password is invalid', async () => {
			const response = await request(server)
				.post('/api/users/login')
				.send({ email: 'any@any.com', password: 'abc123' });
			expect(response.status).toBe(403);
		});

		it('should return the jwt token for the logged in user', async () => {
			const response = await request(server)
				.post('/api/users/login')
				.send({ email: 'any@any.com', password: '12345' });

			const decoded = jwt.verify(response.body.token, secret);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('token');
			expect(decoded.user).toHaveProperty('id');
		});
	});
});
