import dotenv from 'dotenv';
import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';
import { Balancer } from './api/balancer';
import { Server } from './api/server';
import { DBInMemory } from './db/database';
import { DBTransfer } from './types';

dotenv.config();
const PORT = process.env.PORT || 4000;
const numCPUs = cpus().length;


if (cluster.isPrimary) {
  console.log(`Load Balancer is running on port: ${PORT}`);

  const balancer = new Balancer(+PORT, numCPUs).init();
  
  const workers: Array<import("cluster").Worker> = [];

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({forkIndex: i});
    workers.push(worker)
  }

  // Resending consistent DB
    cluster.on('fork', function(worker) {
        worker.on('message', (data: DBTransfer) => {
          workers.forEach(worker=>worker.send(data))
        });
    });

} 
else {
  const dataBase = new DBInMemory();

  const serverPort = +PORT + +(process.env.forkIndex || '') + 1;
  const worker = new Server(dataBase, serverPort, true);
  const server = worker.init();

  // Apply consistent DB changes
  process.on('message', (data: DBTransfer) => {
    dataBase.replaceData(data.db);
  });
  
}

