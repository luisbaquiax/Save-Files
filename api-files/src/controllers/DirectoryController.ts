import { Response, Request } from "express";
import { crearDirectorio, rutaFiles } from "../utils/Utiles";
import path from 'path';
import DirectoryModel from "../data/model/Directorio";
import { DirectoryType } from "../enums/DirectoryType";
import { FileState } from "../enums/FileState";

export const createDirectory = async (request: Request, response: Response) => {
    try {
        const { nombre, idParent } = request.params;
        const carpeta = request.body;

        delete carpeta._id;

        const buscado = await DirectoryModel.findOne({
            nombre: nombre, id_directory: idParent, estado: FileState.ACTIVO
        });

        if (buscado) {
            response.status(409).json({ message: `La carpeta ${nombre} ya existe` });
            return;
        }
        const carpetaPadre = await DirectoryModel.findOne({
            _id: idParent
        })

        const carpetaNueva = new DirectoryModel(carpeta);

        if (!carpetaPadre) {
            response.status(404).json({ message: `No se encontró la carepta padre.` });
            return;
        }

        const rutaCarpeta = nombre

        carpetaNueva.ruta = rutaCarpeta;

        await carpetaNueva.save();


        response.json({ message: `Se ha guardado la carpeta con éxito.` });

    } catch (error) {
        response.status(500).json({ message: `Error en el servidos ${error}` })
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
        } else {
            response.status(404).json({ message: `Directorio raiz no encontrado` });
        }
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}

export const getDirectoriesByParent = async (request: Request, response: Response) => {
    try {
        const { idRoot, estado } = request.params;

        const list = await DirectoryModel.find({
            id_directory: idRoot,
            estado: estado
        });

        response.json(list);
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}

export const getDirectoryByIdAndSatatus = async (request: Request, response: Response) => {
    try {
        const { id, estado } = request.params;
        const carpeta = await DirectoryModel.findOne({
            _id: id,
            estado: estado
        });

        if (!carpeta) {
            response.status(404).json({ message: `Carpeta no encontrada` });
            return;
        }

        response.json(carpeta);

    } catch (error) {
        response.status(500).json({ message: `Errro en el servidor: ${error}` });
    }
}

export const getDirectoryBySatatus = async (request: Request, response: Response) => {
    try {
        const { estado } = request.params;
        const carpeta = await DirectoryModel.findOne({
            estado: estado
        });

        if (!carpeta) {
            response.status(404).json({ message: `Carpeta no encontrada` });
            return;
        }

        response.json(carpeta);

    } catch (error) {
        response.status(500).json({ message: `Errro en el servidor: ${error}` });
    }
}

export const updateDirectory = async (request: Request, response: Response) => {
    try {
        const { carpeta } = request.body;

        const buscado = await DirectoryModel.findOne({ _id: carpeta._id });
        if (!buscado) {
            response.status(404).json({ message: `Carpeta no encontrada` });
            return;
        }

        buscado.nombre = carpeta.nombre;
        buscado.id_directory = carpeta.id_directory;
        buscado.estado = carpeta.estado;

        await buscado.save();

        response.json({ message: `Carpeta actualizado con éxito.` });
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
};
