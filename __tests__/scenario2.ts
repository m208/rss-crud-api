import request from "supertest";
import { server } from '../src/index';

describe('Scenario 2, error handling', () => {
	const endpoint = '/api/users';

	it('GET request by wrong path (404 error message is expected)', async () => {
		const res = await request(server).get('/wrong-path/111');

		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual('Invalid link or method!');
	});

	it('Request with wrong method PATCH (404 error message is expected)', async () => {
		const res = await request(server).patch(endpoint);

		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual('Invalid link or method!');
	});

	it('GET request with not UUID id (400 error message is expected)', async () => {
		const res = await request(server).get(endpoint + '/123');

		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual('User id is incorrect');
	});

	it('Send non JSON data with POST request (500 error message is expected)', async () => {
		const res = await request(server).post(endpoint).send('failedData');

		expect(res.statusCode).toBe(500);
		expect(res.body).toEqual('Server error');
	});


	afterAll(() => {
		server.close();
	});

})