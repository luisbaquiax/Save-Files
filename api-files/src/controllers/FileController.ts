import { Request, Response } from "express";
import ArchivoModel from "../data/model/Archivo";
import DirectoryModel from "../data/model/Directorio";
import { writeFile } from "../utils/Utiles";
import path from 'path';

export const createFile = async (request: Request, response: Response) => {
  try {
    const { 
      id_directory,
      nombre,
      extension,
      estado,
      username_compartido,
      fecha_compartida,
      hora_compartida,
      contenido
    } = request.body;

    const carpeta = await DirectoryModel.findOne({
      _id: id_directory
    });

    const ruta_archivo = carpeta?.ruta + path.sep + nombre + extension;

    const nuevoArchivo = new ArchivoModel({
      id_directory: id_directory,
      nombre: nombre,
      ruta: ruta_archivo,
      extension: extension,
      estado: estado,
      username_compartido: username_compartido,
      fecha_compartida: fecha_compartida,
      hora_compartida: hora_compartida,
      contenido: contenido
    });
    await nuevoArchivo.save();
    writeFile(ruta_archivo, contenido);
    response.json({ message: `Archivo creado con éxito` })
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor ${error}` });
  }
};

export const getFilesByRootState = async (request: Request, response: Response) => {
  try {
    const { idRoot, estado } = request.params;
    const list = await ArchivoModel.find({ id_directory: idRoot, estado: estado });
    response.json(list);
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor ${error}` });
  }
}

export const copyImage = async (request: Request, response: Response ) => {
  try {
    const { archivo } = request.body;
    const image = new ArchivoModel(archivo);

    const directory = await DirectoryModel.findOne({ _id: image.id_directory });

    const rutaImagne = directory?.ruta + path.sep + image.nombre + image.extension;
    

  } catch (error) {
    response.status(500).json({ message: `Error en el servidor ${error}` });
  }
}