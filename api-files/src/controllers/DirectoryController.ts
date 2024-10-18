import { Response, Request } from "express";
import { crearDirectorio, rutaFiles } from "../utils/Utiles";
import path from 'path';
import DirectoryModel from "../data/model/Directorio";
import { DirectoryType } from "../enums/DirectoryType";

export const createDirectory = async (request: Request, response: Response) => {
    try {
        const { username, nombre, estado, idDirectorio } = request.params;
        const rutaDirectorio = rutaFiles + username + path.sep + nombre;
        crearDirectorio(rutaDirectorio);
    } catch (error) {
        response.status(500).json({message: `Error en el servidos ${error}`})
    }
}

export const getDirectoryRoot = async (request: Request, response: Response) => {
    try {
        const { username } = request.params;
        const root = await DirectoryModel.findOne({
            username: username,
            tipo: DirectoryType.ROOT
        });
        if (root) {
            response.json(root);
        }else{
            response.status(404).json({ message: `Directorio raiz no encontrado` });
        }
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}

export const getDirectoriesByUsername = async (request: Request, response: Response) =>{
    try {
        
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}
