<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar proyecto para consumir API

1. Clonar el repositorio

2. Clonar el archivo `.env.template` y renombrarlo a `.env`

3. Llenar las variables de entorno en el archivo `.env`

4. Levantar el proyecto con el comando `docker-compose up --build -d`

5. Reconstruir la base de datos con la semilla

## Stack usado

- NestJS
- MongoDB
- Docker
- Docker Compose

# Production build

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno en `.env.prod`
3. Crear la nueva imagen `docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build -d`
