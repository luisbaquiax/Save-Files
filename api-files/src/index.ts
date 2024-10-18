import { Server } from "./server/Server";
import env from 'dotenv';
import { rutaFiles } from "./utils/Utiles";

env.config();

const server = new Server();