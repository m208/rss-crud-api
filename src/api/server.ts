import http from 'http';
import { ApiResponce, IUserData } from '../types';
import { validate as uuidValidate } from 'uuid';
import { isValidUserData } from '../libs/validatePostData';
import { DBInMemory } from '../db/database';

export class Server {
    dataBase: DBInMemory;
    port: number | string;
    multiwork: boolean;

    constructor(dataBase: DBInMemory, port: number | string, multi = false) {
        this.dataBase = dataBase;
        this.port = port;
        this.multiwork = multi;
    }

    init(){
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
            const invalidPostData = () => {
                sendResponce({
                    status : 400,
                    data: 'Post data incorrect!'
                })
            }
        
            if (usersRouteMatch){
                const id = usersRouteMatch[1].replace('/', '');
        
                if (id && !uuidValidate(id)) {
                    uuidError();
                    return;
                }
        
                if (request.method === 'GET') {
        
                    const query = id? this.dataBase.getUser(id) : this.dataBase.getUsers(); 
        
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
                    request.on('data', (chunk: Uint8Array) => chunks.push(chunk) );
                    request.on('end', () => {
                        try {
                            const data = JSON.parse(Buffer.concat(chunks).toString()) as IUserData;
        
                            if (!isValidUserData(data)) {
                                invalidPostData();
                                return;
                            }
        
                            if (request.method === 'POST' && !id) {
                                const query = this.dataBase.addUser(data);
                
                                answer.status = 201;
                                answer.data = query;

                                if (this.multiwork && query){
                                    process.send?.({ db:  this.dataBase.getUsers()});
                                }
                            }
                
                            else if (request.method === 'PUT' && id) {
                                const query = this.dataBase.updateUser(id, data);
                
                                answer.status = query? 200 : 404;
                                answer.data = query? query : 'User not founded';

                                if (this.multiwork && query){
                                    process.send?.({ db:  this.dataBase.getUsers()});
                                }
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
                    const query = this.dataBase.deleteUser(id);

                    if (this.multiwork && query){
                        process.send?.({ db:  this.dataBase.getUsers()});
                    }
        
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
        
          })
          server.listen(this.port);
          console.log(`Server started on port: ${this.port}`);
          return server;
    }

}