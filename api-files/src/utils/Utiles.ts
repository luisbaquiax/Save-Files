import { promises as fs } from 'fs';
import * as fs2 from 'fs';

export const rutaFiles = '/home/luisbaquiax/Documentos/GraFiles/';

export const crearDirectorio = async (ruta: string) => {
    try {
        await fs.mkdir(ruta, { recursive: true });
        console.log(`Directorio creado: ${ruta}`);
    } catch (error) {
        console.error(`Error al crear el directorio: ${error}`);
    }
};

export const writeFile = async (ruta: string, content: string) => {
    try {
        await fs.writeFile(ruta, content, {
            flag: "w"
        }).then(() => {
            console.log("se ha escrito el archivo")
        })
    } catch (error) {
        console.log(`Error al crear el archivo ${error}`);
    }
};

export const openFile = async (ruta: string): Promise<string> => {
    try {
        const content = await fs.readFile(ruta, 'utf-8');
        return content;
    } catch (error) {
        console.error(`Error al leer el archivo en la ruta ${ruta}: ${error}`);
        throw error;
    }
};

export const readFile = (rutaArchivo: string) => {
    const words = fs2.readFileSync(rutaArchivo, 'utf-8');
    return words;
}
