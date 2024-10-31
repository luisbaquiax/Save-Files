# Save-Files
Proyecto final de Manejo de Archivos, simulacion de un drive

#### Clonar el proyecto

git clone git@github.com:luisbaquiax/Save-Files.git
```
#### windows
```
git clone https://github.com/luisbaquiax/Save-Files.git
```

### Dockerizar el proyecto:

#### Importante crear una imagen de mongodb en docker puerto 27017:27017

Crear la red redfiles
```
create network redfiles
```
Agregar mongodb a la red
```
docker network connect redfiles mongodb
```

Crear la imagen de la aplicación de angular
```
docker build -t angular-docker .
```
Crear el contenedor de la aplicación de angular
```
docker run --name angular-files -p 4201:4200 angular-docker
```
Crear la imagen de la api
```
docker build -t api-files .
```
Crear el contenedor de la api

```
opcion 1: (recomendada): run --name api-files --env-file=./.env --network redfiles -p 3000:3000 api-files
```

## Video GraFiles

Mostrando Funcioanlidades [aquí](https://tinyurl.com/228jacp8).

