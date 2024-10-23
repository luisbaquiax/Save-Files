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
exports.copyImage = exports.getFilesByRootState = exports.createFile = void 0;
const Archivo_1 = __importDefault(require("../data/model/Archivo"));
const Directorio_1 = __importDefault(require("../data/model/Directorio"));
const Utiles_1 = require("../utils/Utiles");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const FileState_1 = require("../enums/FileState");
const createFile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_directory, nombre, extension, estado, username_compartido, fecha_compartida, hora_compartida, contenido } = request.body;
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
            fecha_compartida: fecha_compartida,
            hora_compartida: hora_compartida,
            contenido: contenido
        });
        yield nuevoArchivo.save();
        (0, Utiles_1.writeFile)(ruta_archivo, contenido);
        response.json({ message: `Archivo creado con éxito` });
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.createFile = createFile;
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
            const rutaArchivo = archivoJson.ruta + path_1.default.sep + archivoJson.nombre + archivoJson.extension;
            fs_1.default.writeFileSync(rutaArchivo, request.file.buffer);
            const archivoNuevo = yield new Archivo_1.default({
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
            yield archivoNuevo.save();
            response.json({ message: 'Archivo recibido y guardado correctamente' });
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ message: `Error en el servidor: ${error}` });
        }
    }));
});
exports.copyImage = copyImage;
