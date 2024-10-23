import { Request, Response } from "express";
import ArchivoModel from "../data/model/Archivo";
import DirectoryModel from "../data/model/Directorio";
import { writeFile } from "../utils/Utiles";
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { FileState } from "../enums/FileState";

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

    const archivoBuscado = await ArchivoModel.findOne(
      { nombre: nombre, estado: FileState.ACTIVO, id_directory: id_directory }
    );
    if (archivoBuscado) {
      response.status(409).json({ message: `El archivo ${nombre} ya existe` });
      return;
    }

    const ruta_archivo = carpeta?.ruta + path.sep + nombre;

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

const upload = multer({ storage: multer.memoryStorage() });

export const copyImage = async (request: Request, response: Response) => {
  upload.single('archivo')(request, response, async (err) => {
    if (err instanceof multer.MulterError) {
      return response.status(500).json({ message: `Error de Multer: ${err.message}` });
    } else if (err) {
      return response.status(500).json({ message: `Error desconocido: ${err.message}` });
    }

    try {
      const archivoJson = JSON.parse(request.body.archivoJson);

      if (!request.file) {
        return response.status(400).json({ message: 'No se ha subido ningún archivo' });
      }

      const archivoBuscado  = await ArchivoModel.findOne(
        { nombre: archivoJson.nombre, id_directory: archivoJson.id_directory, estado: FileState.ACTIVO }
      );

      if(archivoBuscado){
        return response.status(401).json({ message: `El archivo ${archivoBuscado.nombre} ya existe` });
      }

      const rutaArchivo = archivoJson.ruta + path.sep + archivoJson.nombre + archivoJson.extension;

      fs.writeFileSync(rutaArchivo, request.file.buffer);

      const archivoNuevo = await new ArchivoModel({
        id_directory: archivoJson.id_directory,
        nombre: archivoJson.nombre,
        ruta: rutaArchivo,
        extension: archivoJson.extension,
        estado: archivoJson.estado,
        username_compartido: archivoJson.username_compartido,
        fecha_compartida: archivoJson.fecha_compartida,
        hora_compartida: archivoJson.hora_compartida,
        contenido: archivoJson.contenido
      });

      await archivoNuevo.save();

      response.json({ message: 'Archivo recibido y guardado correctamente' });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: `Error en el servidor: ${error}` });
    }
  });
};

