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
exports.searchUser = exports.searchUserByUsernamePassword = exports.insertUser = exports.getUsers = void 0;
const Utiles_1 = require("./../utils/Utiles");
const Usuario_1 = __importDefault(require("../data/model/Usuario"));
const Directorio_1 = __importDefault(require("../data/model/Directorio"));
const FileState_1 = require("../enums/FileState");
const DirectoryType_1 = require("../enums/DirectoryType");
const getUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Usuario_1.default.find();
        response.json(users);
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.getUsers = getUsers;
const insertUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, apellido, email, password, username, rol } = request.body;
    const search = yield Usuario_1.default.findOne({ username });
    if (search) {
        response.status(501).json({ message: `El username ${username} ya se encuentra en uso.` });
        return;
    }
    const userCreate = new Usuario_1.default({ nombre, apellido, email, password, username, rol });
    userCreate.password = yield userCreate.encryptPassword(password);
    userCreate.save();
    if (userCreate) {
        //creamos el direcotrio raiz
        const rutaDirectorio = Utiles_1.rutaFiles + username;
        const raiz = new Directorio_1.default({
            id_directory: username,
            username: username,
            nombre: username,
            ruta: rutaDirectorio,
            estado: FileState_1.FileState.ACTIVO,
            username_compartido: username,
            tipo: DirectoryType_1.DirectoryType.ROOT
        });
        raiz.save();
        (0, Utiles_1.crearDirectorio)(username);
        response.json(userCreate);
    }
    else {
        response.status(500).json({ msg: "No se pudo guardar al usario." });
    }
});
exports.insertUser = insertUser;
const searchUserByUsernamePassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = request.params;
        const userBuscado = yield Usuario_1.default.findOne({ username: username });
        if (!userBuscado) {
            response.status(404).json({ message: `Usuario no encontrado` });
            return;
        }
        const verificacion = yield userBuscado.matchPassword(password);
        if (verificacion) {
            response.json(userBuscado);
        }
        else {
            response.status(401).json({ message: 'Contraseña incorrecta' });
        }
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.searchUserByUsernamePassword = searchUserByUsernamePassword;
const searchUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid } = request.params;
        const user = yield Usuario_1.default.findOne({ _id: userid });
        console.log(user);
        if (user) {
            response.json(user);
        }
        else {
            response.status(404).json({ message: `User not found` });
        }
    }
    catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
});
exports.searchUser = searchUser;
