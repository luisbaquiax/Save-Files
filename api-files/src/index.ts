import { Server } from "./server/Server";
import env from 'dotenv';
import * as fs from 'fs';
import { readFile, writeFile } from "./utils/Utiles";


env.config();

const server = new Server();
