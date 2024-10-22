import mongoose from 'mongoose';

const SechemaDirectory = new mongoose.Schema(
    {   username: { type: String, required: true },
        id_directory: { type: String, required: true },
        nombre: { type: String, required: true },
        ruta: { type: String, required: true },
        estado: { type: String, required: true},
        username_compartido: { type: String, required: false },
        tipo: { type: String, required: true },
        contenido: { type: String, required: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const DirectoryModel = mongoose.model("Directory", SechemaDirectory);
export default DirectoryModel;