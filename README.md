# Save-Files
Proyecto final de Manejo de Archivos, simulacion de un drive

## Usar la aplicación

#### Clonar el proyecto

linux
```
git clone git@github.com:luisbaquiax/Save-Files.git
```
windows

```
git clone https://github.com/luisbaquiax/Save-Files.git
```

### Dockerizar el proyecto

#### Importante crear una imagen de mongo con el nombre mongodb en docker, puerto 27017:27017


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

```
opcion 2: run --name api-files --env-file=./.ev -p 3000:3000 api-files
```

Crear la red redfiles

```
docker create network redfiles
```

Agregar mongodb a la red

```
docker network connect redfiles mongodb
```

Agregar el contenedor de la api en la misma red que mongodb

```
docker network connect redfiles api-files
```

## Video GraFiles

Mostrando Funcionalidades [aquí](https://tinyurl.com/228jacp8).

