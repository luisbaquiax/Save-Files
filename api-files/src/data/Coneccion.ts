import mongoose from "mongoose";

const url = "mongodb://localhost:27017/files";

const coneccion = mongoose.connect(url);

export default coneccion;