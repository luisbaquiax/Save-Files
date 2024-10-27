# Etapa de compilación
FROM node:18.10.0 as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos del proyecto
COPY . .

# Compilar la aplicación
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración personalizada de nginx (si la tienes)
# COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos compilados desde la etapa de compilación
COPY --from=build /app/dist/NG-SAVEFILES /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
