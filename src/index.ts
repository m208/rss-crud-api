import dotenv from 'dotenv';
import http from 'http';
import { getUsers, getUser, addUser, updateUser, deleteUser } from './api/methods';
import { DBInMemory } from './db/database';
import { ApiResponce, IUserData } from "./types";
import { validate as uuidValidate } from 'uuid';

dotenv.config();
const PORT = process.env.PORT || 4000;

const dataBase = new DBInMemory();

const server = http.createServer((request, response) => {
    const url = ((request.url || '')  + '/').replace('//', '/').toLowerCase();

    const usersRouteRegexp =/\/api\/users\/(.*)/;
    const usersRouteMatch = url.match(usersRouteRegexp);

    const sendResponce = (data: ApiResponce ) => {
        response.writeHead(data.status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(data.data));
    }

    const uuidError = () => {
        sendResponce({
            status : 400,
            data : 'User id is incorrect'
        })
    }
    const error404 = () => {
        sendResponce({
            status : 404,
            data: 'Invalid link or method!'
        })
    }

    if (usersRouteMatch){
        const id = usersRouteMatch[1].replace('/', '');

        if (id && !uuidValidate(id)) {
            uuidError();
            return;
        }

        if (request.method === 'GET') {

            const query = id? dataBase.getUser(id) : dataBase.getUsers(); 

            sendResponce({
                status : query? 200 : 404,
                data : query? query : 'User not founded'
            })
            
        } 

        else if (request.method === 'POST' || request.method === 'PUT') {

            const answer: ApiResponce = {
                status: 200,
                data: ''
            };

            const chunks: Array<Uint8Array> = [];
            request.on('data', chunk => chunks.push(chunk) );
            request.on('end', () => {
                try {
                    const data = JSON.parse(Buffer.concat(chunks).toString()) as IUserData;

                    if (request.method === 'POST' && !id) {
                        const query = dataBase.addUser(data);
        
                        answer.status = 201;
                        answer.data = query;
                    }
        
                    else if (request.method === 'PUT' && id) {
                        const query = dataBase.updateUser(id, data);
        
                        answer.status = query? 200 : 404;
                        answer.data = query? query : 'User not founded';
                    }
        
                    else {
                        answer.status = 404;
                        answer.data = 'Invalid link or method';
                    }
                } 
                catch (err) {
                    answer.status = 500;
                    answer.data = 'Server error';
                }

              sendResponce(answer);
              
            })
        }

        else if(request.method === 'DELETE' && id) {
            const query = dataBase.deleteUser(id);

            sendResponce({
                status: query? 204 : 404,
                data: query? 'User deleted' : 'User not founded'
            });
        }
        else {
            error404();
        }

    } else {
        error404();
    }

  });

server.listen(PORT);
console.log(`Server started on port: ${PORT}`);