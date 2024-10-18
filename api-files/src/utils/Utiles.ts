import { promises as fs } from 'fs';

export const rutaFiles = '/home/luisbaquiax/Documentos/GraFiles/';

export const crearDirectorio = async (ruta: string) => {
    try {
        await fs.mkdir(rutaFiles + ruta, { recursive: true });
        console.log(`Directorio creado: ${rutaFiles}/${ruta}`);
    } catch (error) {
        console.error(`Error al crear el directorio: ${error}`);
    }
};

