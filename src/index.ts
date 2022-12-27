import dotenv from 'dotenv';
import http from 'http';

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