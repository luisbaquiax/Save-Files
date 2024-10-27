import { getRutaFile, rutaFiles, rutaFilesShardes } from './../utils/Utiles';
import { Request, Response } from "express";
import ArchivoModel from "../data/model/Archivo";
import DirectoryModel from "../data/model/Directorio";
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { FileState } from "../enums/FileState";
import { FileType } from '../enums/FileType';

export const createFile = async (request: Request, response: Response) => {
  try {
    const { 
      id_directory,
      nombre,
      extension,
      estado,
      username_compartido,
      propietario,
      contenido,
      tipo_archivo
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
      propietario: propietario,
      tipo_archivo: tipo_archivo,
      contenido: contenido
    });
    await nuevoArchivo.save();
    response.json({ message: `Archivo creado con éxito` })
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor ${error}` });
  }
};

export const createFileShared = async (request: Request, response: Response) => {
  try {
    const { 
      id_directory,
      nombre,
      ruta,
      extension,
      estado,
      username_compartido,
      propietario,
      contenido,
      tipo_archivo
    } = request.body;

    const { archivoTipo } = request.params;

    const nuevoArchivo = new ArchivoModel({
      id_directory: ' ',
      nombre: nombre,
      ruta: ruta,
      extension: extension,
      estado: estado,
      username_compartido: username_compartido,
      propietario: propietario,
      tipo_archivo: tipo_archivo,
      contenido: contenido
    });

    await nuevoArchivo.save();

    const rutaShared = rutaFilesShardes + nuevoArchivo._id + nuevoArchivo.nombre;

    if(archivoTipo == FileType.IMG){
      nuevoArchivo.ruta = rutaShared;
      
      await nuevoArchivo.save();

      fs.copyFile(ruta, rutaShared, (error) => {
        if (error) {
          console.error(`Error al copiar el archivo: ${error}`);
        } else {
          console.log('todo bien, se copio el archivo');
        }
      });
    }

    response.json({ message: `Archivo creado con éxito` })
   
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor ${error}` });
  }
};

export const updateFile = async (request: Request, response: Response) => {
  try {
    const archivo = request.body;

    const archivoModificado = new ArchivoModel(archivo);

    const archivoBuscado = await ArchivoModel.findOne(
      { 
        nombre: archivoModificado.nombre, 
        estado: FileState.ACTIVO, 
        id_directory: archivoModificado.id_directory,
        _id: { $ne: archivoModificado._id }
      }
    );

    if (archivoBuscado) {
      response.status(409).json({ message: `El archivo ${archivoBuscado.nombre} ya existe` });
    }else{
      const buscado = await ArchivoModel.findOne({ _id: archivoModificado._id });

      if(buscado){
        //eliminar el archivo anterior
  
        //cambiamos los valores
        buscado.nombre = archivoModificado.nombre;
        buscado.extension = archivoModificado.extension;
        buscado.ruta = getRutaFile(archivoModificado.ruta) + archivoModificado.nombre;
        buscado.contenido = archivoModificado.contenido;
        buscado.estado = archivoModificado.estado;

        await buscado.save();
        
        response.json({ message: `Archivo actualizado correctamente.` })
  
      }else{
        response.status(404).json({ message: `Not found file` });
      }
    }
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor: ${error}` });
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

      const archivoNuevo = await new ArchivoModel({ 
        id_directory: archivoJson.id_directory,
        nombre: archivoJson.nombre,
        ruta: ' ',
        extension: archivoJson.extension,
        estado: archivoJson.estado,
        username_compartido: archivoJson.username_compartido,
        propietario: archivoJson.propietario,
        tipo_archivo: archivoJson.tipo_archivo,
        contenido: archivoJson.contenido
      });

      await archivoNuevo.save();
      
      //escribir la imagen
      const rutaArchivo = rutaFiles + archivoNuevo._id + archivoJson.nombre;

      archivoNuevo.ruta = rutaArchivo;
      await archivoNuevo.save();

      fs.writeFileSync(rutaArchivo, request.file.buffer);

      response.json({ message: 'Archivo recibido y guardado correctamente' });
    } catch (error) {
      response.status(500).json({ message: `Error en el servidor: ${error}` });
    }
  });
};

export const updateImage = (request: Request, response: Response) =>{
  try {
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
  
        const archivoNuevo = await new ArchivoModel({ 
          id_directory: archivoJson.id_directory,
          nombre: archivoJson.nombre,
          ruta: ' ',
          extension: archivoJson.extension,
          estado: archivoJson.estado,
          username_compartido: archivoJson.username_compartido,
          propietario: archivoJson.propietario,
          fecha_compartida: archivoJson.fecha_compartida,
          hora_compartida: archivoJson.hora_compartida,
          contenido: archivoJson.contenido
        });
  
        await archivoNuevo.save();
        
        //escribir la imagen
        const rutaArchivo = rutaFiles + path.sep + archivoNuevo._id + archivoJson.nombre;
  
        archivoNuevo.ruta = rutaArchivo;
        await archivoNuevo.save();
  
        fs.writeFileSync(rutaArchivo, request.file.buffer);
  
        response.json({ message: 'Archivo recibido y guardado correctamente' });
      } catch (error) {
        response.status(500).json({ message: `Error en el servidor: ${error}` });
      }
    });
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor: ${error}` });
  }
};

export const getFileShareds = async (request: Request, response: Response) => {
  try {
    const { username } = request.params;

    const list = await ArchivoModel.find({ username_compartido: username });
    response.json(list);
  } catch (error) {
    response.status(500).json({ message: `Error en el servidor: ${error}` });
  }
}


