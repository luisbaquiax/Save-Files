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
exports.getDirectoriesByUsername = exports.getDirectoryRoot = exports.createDirectory = void 0;
const Utiles_1 = require("../utils/Utiles");
const path_1 = __importDefault(require("path"));
const Directorio_1 = __importDefault(require("../data/model/Directorio"));
const DirectoryType_1 = require("../enums/DirectoryType");
const createDirectory = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, nombre, estado, idDirectorio } = request.params;
        const rutaDirectorio = Utiles_1.rutaFiles + username + path_1.default.sep + nombre;
        (0, Utiles_1.crearDirectorio)(rutaDirectorio);
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
const getDirectoriesByUsername = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.getDirectoriesByUsername = getDirectoriesByUsername;
