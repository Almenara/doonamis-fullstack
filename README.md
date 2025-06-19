# Doonamis - Instalación Manual (Angular 20 + Laravel 12 + MySQL)

Este proyecto es un stack **fullstack** con **Angular 20** (frontend), **Laravel 12** (backend) y **MySQL** como base de datos.  
A continuación se explica cómo instalar y ejecutar el proyecto **sin Docker**.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) (recomendado Node 18+)
- [Composer](https://getcomposer.org/) (para Laravel)
- [MySQL](https://www.mysql.com/) instalado y corriendo localmente

---

## Estructura del proyecto

```
doonamis/
│
├── back/         # Laravel 12 (backend)
├── front/        # Angular 20 (frontend)
└── ...
```

---

## Instalación y ejecución SIN Docker

### 1. Clona el repositorio

```sh
git clone https://github.com/Almenara/doonamis-fullstack
cd doonamis
```

---

### 2. Instala y ejecuta el **Frontend** (Angular 20)

```sh
cd front
npm install
npm start
```

- Accede a [http://localhost:8000](http://localhost:8000) para ver la aplicación Angular.

---

### 3. Instala y ejecuta el **Backend** (Laravel 12)

```sh
cd ../back
composer install
cp .env.example .env
```

- Configura el archivo `.env` con tus credenciales de MySQL locales, por ejemplo:

  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=doonamis_db
  DB_USERNAME=tu_usuario
  DB_PASSWORD=tu_contraseña
  ```

- Genera la clave de la aplicación:

  ```sh
  php artisan key:generate
  ```

- Ejecuta migraciones y seeders:

  ```sh
  php artisan migrate --seed
  ```

- Inicia el servidor de desarrollo de Laravel:

  ```sh
  php artisan serve --host=0.0.0.0 --port=8080
  ```

- El backend estará disponible en [http://localhost:8080](http://localhost:8080)

---

## Acceso a los servicios

- **Frontend (Angular 20):** [http://localhost:8000](http://localhost:8000)
- **Backend (Laravel 12):** [http://localhost:8080](http://localhost:8080)
- **MySQL:**  
  - Host: `127.0.0.1`
  - Puerto: `3306`
  - Usuario y contraseña: los que configures en tu `.env`

---

## Instalación con Docker (opcional)

Si prefieres usar Docker, consulta la sección `docker-compose.yml` y los archivos de configuración incluidos en el proyecto.

---

## Notas

- Si modificas el frontend o backend, reinicia sus servidores para ver los cambios.
- Asegúrate de que la base de datos MySQL esté creada y accesible antes de ejecutar migraciones.