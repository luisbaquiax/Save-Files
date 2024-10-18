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
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearDirectorio = exports.rutaFiles = void 0;
const fs_1 = require("fs");
exports.rutaFiles = '/home/luisbaquiax/Documentos/GraFiles/';
const crearDirectorio = (ruta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.promises.mkdir(exports.rutaFiles + ruta, { recursive: true });
        console.log(`Directorio creado: ${exports.rutaFiles}/${ruta}`);
    }
    catch (error) {
        console.error(`Error al crear el directorio: ${error}`);
    }
});
exports.crearDirectorio = crearDirectorio;
