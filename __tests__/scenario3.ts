import request from "supertest";
import { server } from '../src/index';

describe('Scenario 3, validation for post data', () => {
    const endpoint = '/api/users';

    it('Trying create user with missing properties (error message is expected)', async () => {
        const user = {
            username: "Name",
            hobbies: []
        }
        const res = await request(server).post(endpoint).send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Post data incorrect!');
    });

    it('Trying create user with wrong property types (Age as string) (error message is expected)', async () => {
        const user = {
            username: "Name",
            age: "33",
            hobbies: []
        }
        const res = await request(server).post(endpoint).send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Post data incorrect!');
    });

    it('Trying create user with wrong property types (Name as number) (error message is expected)', async () => {
        const user = {
            username: 11111,
            age: 33,
            hobbies: []
        }
        const res = await request(server).post(endpoint).send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Post data incorrect!');
    });

    it('Trying create user with wrong property types (hobbies is not an array) (error message is expected)', async () => {
        const user = {
            username: "Name",
            age: 33,
            hobbies: 'hobbie1, hobbie2, hobbie3'
        }
        const res = await request(server).post(endpoint).send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Post data incorrect!');
    });

    it('Trying create user with wrong property types (hobbies array contain numbers) (error message is expected)', async () => {
        const user = {
            username: "Name",
            age: 33,
            hobbies: ['hobbie1', 'hobbie2', 12334]
        }
        const res = await request(server).post(endpoint).send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Post data incorrect!');
    });

    it('Trying create user with wrong property types (hobbies array contain objects) (error message is expected)', async () => {
        const user = {
            username: "Name",
            age: 33,
            hobbies: ['hobbie1', new Array(10).fill(0), {id: 123, data: 'data'}]
        }

        const res = await request(server).post(endpoint).send(user);

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Post data incorrect!');
    });

    afterAll(() => {
        server.close();
    });

})