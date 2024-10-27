"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SechemaDirectory = new mongoose_1.default.Schema({ username: { type: String, required: true },
    id_directory: { type: String, required: true },
    nombre: { type: String, required: true },
    ruta: { type: String, required: true },
    estado: { type: String, required: true },
    username_compartido: { type: String, required: false },
    tipo: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});
const DirectoryModel = mongoose_1.default.model("Directory", SechemaDirectory);
exports.default = DirectoryModel;
