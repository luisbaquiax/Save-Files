import  mongoose from 'mongoose';
import bcrypt from "bcryptjs";

interface IUser extends Document {
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: Date;
    password: string;
    username: string;
    rol: string;
    encryptPassword(password: string): Promise<string>;
    matchPassword(password: string): Promise<boolean>;
  }

const UserSchema = new mongoose.Schema<IUser>(
    {
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        username: { type: String, required: true },
        rol: { type: String, required: true }
    },
    {
        timestamps: false,
        versionKey: false
    }
);

UserSchema.methods.encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  
  UserSchema.methods.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };

  const UserModel = mongoose.model<IUser>("User", UserSchema);
  export default UserModel;
