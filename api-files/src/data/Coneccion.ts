import mongoose from "mongoose";
import env from 'dotenv';
env.config();

const url = "mongodb://mongodb:27017/files";
//const url = "mongodb://localhost:27017/files";

const coneccion = mongoose.connect(url);

export default coneccion;