import { crearDirectorio, rutaFiles } from './../utils/Utiles';
import { Request, Response } from "express";
import UserModel from "../data/model/Usuario";
import DirectoryModel from '../data/model/Directorio';
import path from 'path';
import { FileState } from '../enums/FileState';
import { DirectoryType } from '../enums/DirectoryType';
import { UserType } from '../enums/UserType';


export const getUsers = async (request: Request, response: Response) => {
    try {
        const users = await UserModel.find({ rol: UserType.EMPLEADO });
        response.json(users);
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}


export const insertUser = async (request: Request, response: Response) => {
    const { nombre, apellido, email, password, username, rol } = request.body;

    const search = await UserModel.findOne({ username });

    if (search) {
        response.status(501).json({ message: `El username ${username} ya se encuentra en uso.` });
        return;
    }

    const userCreate = new UserModel({ nombre, apellido, email, password, username, rol });
    userCreate.password = await userCreate.encryptPassword(password);

    userCreate.save();

    if (userCreate) {
        //creamos el direcotrio raiz
        const rutaDirectorio = rutaFiles + username;
        const raiz = new DirectoryModel(
            {
                id_directory: username,
                username: username,
                nombre: username,
                ruta: rutaDirectorio,
                estado: FileState.ACTIVO,
                username_compartido: username,
                tipo: DirectoryType.ROOT
            });
        await raiz.save();
        //crearDirectorio(rutaDirectorio);
        response.json(userCreate);
    } else {
        response.status(500).json({ msg: "No se pudo guardar al usario." });
    }
}

export const searchUserByUsernamePassword = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.params;

        const userBuscado = await UserModel.findOne({ username: username });

        if (!userBuscado) {
            response.status(404).json({ message: `Usuario no encontrado` });
            return;
        }

        const verificacion = await userBuscado.matchPassword(password);

        if (verificacion) {
            response.json(userBuscado);
        } else {
            response.status(401).json({ message: 'Contraseña incorrecta' });
        }

    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}

export const searchUser = async (request: Request, response: Response) => {
    try {
        const { userid } = request.params;
        const user = await UserModel.findOne({ _id: userid });
        console.log(user);
        if (user) {
            response.json(user);
        } else {
            response.status(404).json({ message: `User not found` });
        }
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { nuevaContra } = request.params;
        const { username } = request.body;

        const usuarioBuscado = await UserModel.findOne({ username: username });

        if (!usuarioBuscado) {
            response.status(404).json({ message: `User not found` });
            return;
        }

        usuarioBuscado.password = await usuarioBuscado.encryptPassword(nuevaContra);

        usuarioBuscado.save();

        response.json({ message: `Se ha cambiado la contraseña correctamente` });

    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}

export const getUsersByStatus = async (request: Request, response: Response) => {
    try {
        const { idUser } = request.params;
        const users = await UserModel.find({ _id: { $ne: idUser } });
        response.json(users);
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
};

export const addUsersDefault = async (request: Request, response: Response) => {
    try {
        // Agregar usuarios por defecto a la base de datos
        const usersFind = await UserModel.find();

        const adminUser = new UserModel({
            nombre: 'admin',
            apellido: 'admin',
            email: "amdin@gmail.com",
            password: 'admin',
            username: 'admin', rol: UserType.ADMIN
        });
        const user1 =  new UserModel({
            nombre: 'Luis',
            apellido: 'Baquiax',
            email: "user1@gmail.com",
            password: '1234',
            username: 'user1', rol: UserType.EMPLEADO
        });
        const user2 =  new UserModel({
            nombre: 'Alejandro',
            apellido: 'Gómez',
            email: "ale@gmail.com",
            password: '1234',
            username: 'user2', rol: UserType.EMPLEADO
        });

        if (usersFind.length == 0) {
            adminUser.password = await adminUser.encryptPassword(adminUser.password);
            user1.password = await user1.encryptPassword(user1.password);
            user2.password = await user2.encryptPassword(user2.password);
            await adminUser.save();
            await user1.save();
            await user2.save();
        }
        response.json({ message: `Usuarios agregados` })
    } catch (error) {
        response.status(500).json({ message: `Error en el servidor ${error}` });
    }
}