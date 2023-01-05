import dotenv from 'dotenv';
import { DBInMemory } from './db/database';
import { ServerApp } from './api/server';

dotenv.config();
const PORT = process.env.PORT || 4000;

const dataBase = new DBInMemory();

export const server = new ServerApp(dataBase, PORT).init();


