"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SchemaFile = new mongoose_1.default.Schema({
    id_directory: { type: String, required: true },
    nombre: { type: String, required: true },
    ruta: { type: String, required: true },
    extension: { type: String, required: true },
    estado: { type: String, required: true },
    username_compartido: { type: String, required: false },
    propietario: { type: String, required: false },
    contenido: { type: String, required: true },
    tipo_archivo: { type: String, required: true } //
}, {
    timestamps: true,
    versionKey: false
});
const ArchivoModel = mongoose_1.default.model("File", SchemaFile);
exports.default = ArchivoModel;
