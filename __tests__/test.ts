// import {describe, expect, test} from '@jest/globals';
// const sum = (a:number, b:number)=>a+b

// describe('sum module', () => {
//   test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });
// });



import request from "supertest";

const baseUrl = 'https://jsonplaceholder.typicode.com/';

describe('Todos endpoint', () => {
	it('should return a 200 status code', async () => {
		const response = await request(baseUrl)
			.get('todos/1');

		expect(response.statusCode).toBe(200);
	});
})