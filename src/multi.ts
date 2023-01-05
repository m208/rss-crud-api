import dotenv from 'dotenv';
import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';
import { Balancer } from './api/balancer';
import { Server } from './api/server';
import { DBInMemory } from './db/database';

const numCPUs = cpus().length;

const messageHandler = (msg: any) => console.log(msg);

dotenv.config();
const PORT = process.env.PORT || 4000;

const dataBase = new DBInMemory();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const balancer = new Balancer(PORT, numCPUs).init();
  

  for (let i = 0; i < 1; i++) {
    const worker = cluster.fork({forkIndex: i});
    }

    cluster.on('fork', function(worker) {
        worker.on('message', messageHandler);
        worker.send({ chat: 'Ok worker, Master got the message! Over and out!' });
    })


  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

} else {
  const serverPort = +PORT + +(process.env.forkIndex || '') + 1;
  const server = new Server(dataBase, serverPort).init();
  

  process.on('message', messageHandler);
  process.send?.({ cmd: `my index: ${process.env.forkIndex}` });


//   console.log(`Worker ${process.pid} started`);
//   console.log(process.env.forkIndex);
  
}

