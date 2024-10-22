"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.openFile = exports.writeFile = exports.crearDirectorio = exports.rutaFiles = void 0;
const fs_1 = require("fs");
const fs2 = __importStar(require("fs"));
exports.rutaFiles = '/home/luisbaquiax/Documentos/GraFiles/';
const crearDirectorio = (ruta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.promises.mkdir(ruta, { recursive: true });
        console.log(`Directorio creado: ${ruta}`);
    }
    catch (error) {
        console.error(`Error al crear el directorio: ${error}`);
    }
});
exports.crearDirectorio = crearDirectorio;
const writeFile = (ruta, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.promises.writeFile(ruta, content, {
            flag: "w"
        }).then(() => {
            console.log("se ha escrito el archivo");
        });
    }
    catch (error) {
        console.log(`Error al crear el archivo ${error}`);
    }
});
exports.writeFile = writeFile;
const openFile = (ruta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = yield fs_1.promises.readFile(ruta, 'utf-8');
        return content;
    }
    catch (error) {
        console.error(`Error al leer el archivo en la ruta ${ruta}: ${error}`);
        throw error;
    }
});
exports.openFile = openFile;
const readFile = (rutaArchivo) => {
    const words = fs2.readFileSync(rutaArchivo, 'utf-8');
    return words;
};
exports.readFile = readFile;
