import express, { Application, Request, Response } from 'express';
import corse from 'cors';
import database from '../data/Coneccion';
import routerUsers from '../routers/RouterUsers';
import routerDirectories from '../routers/RouterDirectories';

export class Server {

    public app: Application;
    public puerto: String;

    constructor() {
        this.app = express();
        this.puerto = process.env.PORT || '30001';
        this.listen();
        this.middlewares();
        this.routes();
        this.getConeccion();
    }

    listen() {
        this.app.listen(this.puerto, () => {
          console.log(`aplicacion corriendo en puert ${this.puerto}`);
        });
      }

    middlewares() {
        this.app.use(express.json());
        this.app.use(corse());
    }

    routes() {
        this.app.get("/", (request: Request, response: Response) => {
          response.json({
            msg: "API corriendo... Hola Luis",
          });
        });
        this.app.use('/users', routerUsers)
        this.app.use('/directories', routerDirectories)
      }

    async getConeccion(){
        try {
            await database;
            console.log('coneccion exitosa')
        } catch (error) {
            console.log('Fallos al conectar ', error)
        }
    }

}