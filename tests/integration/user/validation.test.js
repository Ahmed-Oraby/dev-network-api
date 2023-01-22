const request = require('supertest');
const mongoose = require('mongoose');
const runServer = require('../../../src/index');
const User = require('../../../src/models/User');

describe('User route validation: /api/users', () => {
	beforeAll(() => {
		console.log = jest.fn();
		server = runServer();
	});

	afterAll(async () => {
		await User.collection.drop();
		await mongoose.connection.close();
		server.close();
	});

	it('Should return 400 if name is missing.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ email: 'any@any.com', password: '12345' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if email is missing.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'ahmed', password: '12345' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if password is missing.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'ahmed', email: 'any@any.com' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if email is an invalid email address.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'ahmed', email: 'any123', password: '12345' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if name is less than 3 characters.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'a', email: 'any@any.com', password: '12345' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if name is more than 50 characters.', async () => {
		const name = new Array(55).join('z');
		const response = await request(server)
			.post('/api/users/register')
			.send({ name, email: 'any@any.com', password: '12345' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if password is less than 5 characters.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'ahmed', email: 'any@any.com', password: '123' });
		expect(response.status).toBe(400);
	});
	it('Should return 400 if password is more than 255 characters.', async () => {
		const password = new Array(260).join('h');
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'ahmed', email: 'any@any.com', password });
		expect(response.status).toBe(400);
	});
	it('Should return 200 if there is no validation error.', async () => {
		const response = await request(server)
			.post('/api/users/register')
			.send({ name: 'ahmed', email: 'any@any.com', password: '12345' });
		expect(response.status).toBe(200);
	});
});
