import dotenv from 'dotenv';
import http from 'http';
import { getUsers, getUser, addUser, updateUser, deleteUser } from './api/methods';
import { IUser } from "./types";


dotenv.config();
const PORT = process.env.PORT || 4000;

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    const url = ((request.url || '')  + '/').replace('//', '/').toLowerCase();

    const usersRouteRegexp =/\/api\/users\/(.*)/;
    const usersRouteMatch = url.match(usersRouteRegexp);

    let message = {};

    if (usersRouteMatch){
        const id = usersRouteMatch[1].replace('/', '');

        if (request.method === 'GET'){
            
            id ? getUser(id) : getUsers();
            
        } 

        else if(request.method === 'POST' || request.method === 'PUT') {
            const chunks: Uint8Array[] = [];
            request.on('data', chunk => chunks.push(chunk));
            request.on('end', () => {
              const data = JSON.parse(Buffer.concat(chunks).toString()) as IUser;
              
              if (request.method === 'POST' && !id) {
                addUser(data);
              }

              else if (request.method === 'PUT' && id) {
                updateUser(id, data);
              }

              else console.log('error')
              
            })
        }

        else if(request.method === 'DELETE' && id) {
            deleteUser(id);
        }

        else console.log('error')



        message = { 
            data: id? `one user with ID ${id}` : 'All users'
        }
    } else {
        message = {
            data: 'page not found',
        };
    }

    response.end(JSON.stringify(message));

  });



server.listen(PORT);
console.log(`Server started on port: ${PORT}`);