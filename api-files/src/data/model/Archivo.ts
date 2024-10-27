import mongoose from "mongoose";

const SchemaFile =  new mongoose.Schema(
    {
        id_directory: { type: String, required: true },
        nombre: { type: String, required: true },
        ruta: { type: String, required: true },
        extension: { type: String, required: true },
        estado: { type: String, required: true },
        username_compartido: { type: String, required: false },
        propietario: { type: String, required: false },
        contenido: { type: String, required: true },
        tipo_archivo: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ArchivoModel = mongoose.model("File", SchemaFile);
export default ArchivoModel;