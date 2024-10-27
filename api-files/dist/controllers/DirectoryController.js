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
exports.updateDirectory = exports.getDirectoryByIdAndSatatus = exports.getDirectoriesByParent = exports.getDirectoryRoot = exports.createDirectory = void 0;
const Directorio_1 = __importDefault(require("../data/model/Directorio"));
const DirectoryType_1 = require("../enums/DirectoryType");
const FileState_1 = require("../enums/FileState");
const createDirectory = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, idParent } = request.params;
        const carpeta = request.body;
        if (carpeta._id === '') {
            delete carpeta._id;
        }
        const buscado = yield Directorio_1.default.findOne({
            nombre: nombre, id_directory: idParent, estado: FileState_1.FileState.ACTIVO
        });
        if (buscado) {
            response.status(409).json({ message: `La carpeta ${nombre} ya existe` });
            return;
        }
        const carpetaPadre = yield Directorio_1.default.findOne({
            _id: idParent
        });
        const carpetaNueva = new Directorio_1.default(carpeta);
        if (!carpetaPadre) {
            response.status(404).json({ message: `No se encontró la carepta padre.` });
            return;
        }
        const rutaCarpeta = nombre;
        carpetaNueva.ruta = rutaCarpeta;
        yield carpetaNueva.save();
        response.json({ message: `Se ha guardado la carpeta con éxito.` });
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidos ${error}` });
    }
});
exports.createDirectory = createDirectory;
const getDirectoryRoot = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = request.params;
        const root = yield Directorio_1.default.findOne({
            username: username,
            tipo: DirectoryType_1.DirectoryType.ROOT
        });
        if (root) {
            response.json(root);
        }
        else {
            response.status(404).json({ message: `Directorio raiz no encontrado` });
        }
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.getDirectoryRoot = getDirectoryRoot;
const getDirectoriesByParent = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idRoot, estado } = request.params;
        const list = yield Directorio_1.default.find({
            id_directory: idRoot,
            estado: estado
        });
        response.json(list);
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.getDirectoriesByParent = getDirectoriesByParent;
const getDirectoryByIdAndSatatus = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, estado } = request.params;
        const carpeta = yield Directorio_1.default.findOne({
            _id: id,
            estado: estado
        });
        if (!carpeta) {
            response.status(404).json({ message: `Carpeta no encontrada` });
            return;
        }
        response.json(carpeta);
    }
    catch (error) {
        response.status(500).json({ message: `Errro en el servidor: ${error}` });
    }
});
exports.getDirectoryByIdAndSatatus = getDirectoryByIdAndSatatus;
const updateDirectory = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carpeta } = request.body;
        const buscado = yield Directorio_1.default.findOne({ _id: carpeta._id });
        if (!buscado) {
            response.status(404).json({ message: `Carpeta no encontrada` });
            return;
        }
        buscado.nombre = carpeta.nombre;
        buscado.id_directory = carpeta.id_directory;
        buscado.estado = carpeta.estado;
        yield buscado.save();
        response.json({ message: `Carpeta actualizado con éxito.` });
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.updateDirectory = updateDirectory;
