"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SchemaRaiz = new mongoose_1.default.Schema({
    username: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
});
const DirectorioRaiz = mongoose_1.default.model('Raiz', SchemaRaiz);
exports.default = DirectorioRaiz;
