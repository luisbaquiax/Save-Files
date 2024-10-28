# Especifica la imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de npm
COPY package*.json ./

# Instala las dependencias de npm
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que tu aplicación escucha (cambiar según tu aplicación)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
