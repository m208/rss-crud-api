import request from "supertest";
import { server } from '../src/index';
import { IUserData } from "../src/types";

const sampleUser: IUserData = {
    username: 'Sample name',
    age: 33,
    hobbies: ['sample hobbie']
};

const updateForUser: IUserData = {
    username: 'Another name',
    age: 22,
    hobbies: []
};

describe('Scenario 1, basic usage', () => {
	const endpoint = '/api/users';
	let createdUserId = '';

	it('Get all records with a GET api/users request (an empty array is expected)', async () => {
		const res = await request(server).get(endpoint);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);
	});

	it('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
		const res = await request(server).post(endpoint).send(sampleUser);
		createdUserId = res.body.id;
		
		expect(res.statusCode).toEqual(201);
		expect(res.body).toEqual({ 
			id: createdUserId,
			 ...sampleUser 
			}
		);
	});

	it('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
		const res = await request(server).get(endpoint + '/' + createdUserId);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ 
			id: createdUserId,
			 ...sampleUser 
			}
		);
	});

	it('We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id', async () => {
		const res = await request(server).put(endpoint + '/' + createdUserId).send(updateForUser);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ 
			id: createdUserId,
			 ...updateForUser 
			}
		);
	});

	it('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
		const res = await request(server).delete(endpoint + '/' + createdUserId);
	
		expect(res.statusCode).toBe(204);
	});

	it('With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)', async () => {
		const res = await request(server).get(endpoint + '/' + createdUserId);
	
		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual('User not founded');
	});

	afterAll(() => {
		server.close();
	});

})