"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeleteds = exports.getFileShareds = exports.updateImage = exports.copyImage = exports.getFilesByRootState = exports.updateFile = exports.createFileShared = exports.createFile = void 0;
const Utiles_1 = require("./../utils/Utiles");
const Archivo_1 = __importDefault(require("../data/model/Archivo"));
const Directorio_1 = __importDefault(require("../data/model/Directorio"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const FileState_1 = require("../enums/FileState");
const FileType_1 = require("../enums/FileType");
const createFile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_directory, nombre, extension, estado, username_compartido, propietario, contenido, tipo_archivo } = request.body;
        const carpeta = yield Directorio_1.default.findOne({
            _id: id_directory
        });
        const archivoBuscado = yield Archivo_1.default.findOne({ nombre: nombre, estado: FileState_1.FileState.ACTIVO, id_directory: id_directory });
        if (archivoBuscado) {
            response.status(409).json({ message: `El archivo ${nombre} ya existe` });
            return;
        }
        const ruta_archivo = (carpeta === null || carpeta === void 0 ? void 0 : carpeta.ruta) + path_1.default.sep + nombre;
        const nuevoArchivo = new Archivo_1.default({
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
        yield nuevoArchivo.save();
        response.json({ message: `Archivo creado con éxito` });
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.createFile = createFile;
const createFileShared = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_directory, nombre, ruta, extension, estado, username_compartido, propietario, contenido, tipo_archivo } = request.body;
        const { archivoTipo } = request.params;
        const nuevoArchivo = new Archivo_1.default({
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
        yield nuevoArchivo.save();
        const rutaShared = Utiles_1.rutaFilesShardes + nuevoArchivo._id + nuevoArchivo.nombre;
        if (archivoTipo == FileType_1.FileType.IMG) {
            nuevoArchivo.ruta = rutaShared;
            yield nuevoArchivo.save();
            fs_1.default.copyFile(ruta, rutaShared, (error) => {
                if (error) {
                    console.error(`Error al copiar el archivo: ${error}`);
                }
                else {
                    console.log('todo bien, se copio el archivo');
                }
            });
        }
        response.json({ message: `Archivo creado con éxito` });
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.createFileShared = createFileShared;
const updateFile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const archivo = request.body;
        const archivoModificado = new Archivo_1.default(archivo);
        const archivoBuscado = yield Archivo_1.default.findOne({
            nombre: archivoModificado.nombre,
            estado: FileState_1.FileState.ACTIVO,
            id_directory: archivoModificado.id_directory,
            _id: { $ne: archivoModificado._id }
        });
        if (archivoBuscado) {
            response.status(409).json({ message: `El archivo ${archivoBuscado.nombre} ya existe` });
        }
        else {
            const buscado = yield Archivo_1.default.findOne({ _id: archivoModificado._id });
            if (buscado) {
                //eliminar el archivo anterior
                //cambiamos los valores
                buscado.nombre = archivoModificado.nombre;
                buscado.extension = archivoModificado.extension;
                buscado.ruta = (0, Utiles_1.getRutaFile)(archivoModificado.ruta) + archivoModificado.nombre;
                buscado.contenido = archivoModificado.contenido;
                buscado.estado = archivoModificado.estado;
                buscado.id_directory = archivoModificado.id_directory;
                yield buscado.save();
                response.json({ message: `Archivo actualizado correctamente.` });
            }
            else {
                response.status(404).json({ message: `Not found file` });
            }
        }
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor: ${error}` });
    }
});
exports.updateFile = updateFile;
const getFilesByRootState = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idRoot, estado } = request.params;
        const list = yield Archivo_1.default.find({ id_directory: idRoot, estado: estado });
        response.json(list);
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.getFilesByRootState = getFilesByRootState;
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const copyImage = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single('archivo')(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err instanceof multer_1.default.MulterError) {
            return response.status(500).json({ message: `Error de Multer: ${err.message}` });
        }
        else if (err) {
            return response.status(500).json({ message: `Error desconocido: ${err.message}` });
        }
        try {
            const archivoJson = JSON.parse(request.body.archivoJson);
            if (!request.file) {
                return response.status(400).json({ message: 'No se ha subido ningún archivo' });
            }
            const archivoBuscado = yield Archivo_1.default.findOne({ nombre: archivoJson.nombre, id_directory: archivoJson.id_directory, estado: FileState_1.FileState.ACTIVO });
            if (archivoBuscado) {
                return response.status(401).json({ message: `El archivo ${archivoBuscado.nombre} ya existe` });
            }
            const archivoNuevo = yield new Archivo_1.default({
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
            yield archivoNuevo.save();
            //escribir la imagen
            const rutaArchivo = Utiles_1.rutaFiles + archivoNuevo._id + archivoJson.nombre;
            archivoNuevo.ruta = rutaArchivo;
            yield archivoNuevo.save();
            fs_1.default.writeFileSync(rutaArchivo, request.file.buffer);
            response.json({ message: 'Archivo recibido y guardado correctamente' });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ message: `Error en el servidor: ${error}` });
        }
    }));
});
exports.copyImage = copyImage;
const updateImage = (request, response) => {
    try {
        upload.single('archivo')(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err instanceof multer_1.default.MulterError) {
                return response.status(500).json({ message: `Error de Multer: ${err.message}` });
            }
            else if (err) {
                return response.status(500).json({ message: `Error desconocido: ${err.message}` });
            }
            try {
                const archivoJson = JSON.parse(request.body.archivoJson);
                if (!request.file) {
                    return response.status(400).json({ message: 'No se ha subido ningún archivo' });
                }
                const archivoBuscado = yield Archivo_1.default.findOne({
                    nombre: archivoJson.nombre,
                    estado: FileState_1.FileState.ACTIVO,
                    id_directory: archivoJson.id_directory,
                    _id: { $ne: archivoJson._id }
                });
                if (archivoBuscado) {
                    return response.status(401).json({ message: `El archivo ${archivoBuscado.nombre} ya existe` });
                }
                const fileUPdate = yield Archivo_1.default.findOne({ _id: archivoJson._id });
                if (!fileUPdate) {
                    return response.status(402).json({ message: 'No se ha subido ningún archivo' });
                }
                fileUPdate.id_directory = archivoJson.id_directory;
                fileUPdate.nombre = archivoJson.nombre;
                fileUPdate.ruta = archivoJson.ruta;
                fileUPdate.extension = archivoJson.extension;
                fileUPdate.estado = archivoJson.estado;
                fileUPdate.username_compartido = archivoJson.username_compartido;
                fileUPdate.propietario = archivoJson.propietario;
                fileUPdate.tipo_archivo = archivoJson.tipo_archivo;
                fileUPdate.contenido = archivoJson.contenido;
                yield fileUPdate.save();
                //escribir la imagen
                const rutaArchivo = Utiles_1.rutaFiles + path_1.default.sep + fileUPdate._id + archivoJson.nombre;
                fileUPdate.ruta = rutaArchivo;
                yield fileUPdate.save();
                fs_1.default.writeFileSync(rutaArchivo, request.file.buffer);
                response.json({ message: 'Archivo recibido y guardado correctamente' });
            }
            catch (error) {
                response.status(500).json({ message: `Error en el servidor: ${error}` });
            }
        }));
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor: ${error}` });
    }
};
exports.updateImage = updateImage;
const getFileShareds = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = request.params;
        const list = yield Archivo_1.default.find({ username_compartido: username });
        response.json(list);
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor: ${error}` });
    }
});
exports.getFileShareds = getFileShareds;
const getDeleteds = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield Archivo_1.default.find({ estado: FileState_1.FileState.ELIMINADO });
        response.json(list);
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor: ${error}` });
    }
});
exports.getDeleteds = getDeleteds;
