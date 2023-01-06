import http from 'http';

export class Balancer {
    port: number;
    counter = 1;
    forksCount: number;

    constructor(port: number, forksCount: number) {
        this.port = port;
        this.forksCount = forksCount;
    }

    init() {
        const balancer = http.createServer((request, response) => {
            const chunks: Array<Uint8Array> = [];
            request.on('data', (chunk: Uint8Array) => chunks.push(chunk) );

            request.on('end', () => {
                (this.counter === this.forksCount) ? this.counter = 1 : this.counter++ 

                const options = {
                    hostname: 'localhost',
                    port: +this.port + this.counter,
                    path: request.url,
                    method: request.method,
                };

                console.log(`request redirected to ${options.hostname}:${options.port}`);
                
                const redirect = http.request(options);
                redirect.write(chunks.toString());
                redirect.end();

                redirect.on('response', (worker) => {
                    const chunks: Array<Uint8Array> = [];
                    worker.on('data', (chunk: Uint8Array) => chunks.push(chunk));
                    worker.on('end', () => {
                        response.writeHead(worker.statusCode!, { 'Content-Type': 'application/json' });
                        response.end(chunks.toString());
                    });
                });
            });
        });

        balancer.listen(this.port);
        return balancer;
    }
}