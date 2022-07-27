# Restaurant App (front)

1. Para poder ejecutar el proyecto clonar el proyecto en su computadora
2. Moverse dentro de la carpeta donde se descargo el proyecto ej cd front-restaurante
3. Deben tener instalado docker y docker-compose
4. configurar el archivo .env, puede copiar el archivo example.env y renombrarlo a .env
   una vez que tiene el archivo .env configurar la variable PUERTO

## Install the dependencies

```bash
docker-compose run front npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
docker-compose up
```

si no le emitio error pruebe la url que devolvio para acceder al proyecto
si emitio un error pruebe ejecutar el siguiente comando

```bash
docker-compose run front quasar upgrade --install
```

Lo que hace ese comando es actualizar la version de quasar

vuelva a ejecutar el comando

```bash
docker-compose up
```

si deberia funcionar ...
Para ejecutar el proyecto de manera en segundo plano ejecutar el comando

```bash
docker-compose up -d
```

### Lint the files

```bash
npm run lint
```

### Format the files

```bash
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
