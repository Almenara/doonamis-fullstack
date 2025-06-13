# Doonamis - Entorno Dockerizado (Angular + Laravel + MySQL)

Este proyecto proporciona un entorno de desarrollo completo con **Angular** (frontend), **Laravel** (backend) y **MySQL** como base de datos, todo orquestado con Docker Compose.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) instalados (solo si quieres trabajar fuera de Docker)
- [Composer](https://getcomposer.org/) instalado (solo si quieres trabajar fuera de Docker)

---

## Estructura del proyecto

```
doonamis/
│
├── back/         # Proyecto Laravel
├── front/        # Proyecto Angular
├── nginx/        # Configuración de Nginx
│   └── nginx.conf
├── docker-compose.yml
└── ...
```

---

## Primeros pasos

### 1. Clona el repositorio

```sh
git clone https://github.com/tuusuario/doonamis.git
cd doonamis
```

### 2. (Opcional) Crea los proyectos si no existen

- **Angular:**  
  ```sh
  cd front
  ng new . --skip-git
  cd ..
  ```

- **Laravel:**  
  ```sh
  cd back
  composer create-project laravel/laravel .
  cd ..
  ```

### 3. Configura el archivo `.env` de Laravel

Asegúrate de que el archivo `back/.env` tenga estos valores para la base de datos:

```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=doonamis_db
DB_USERNAME=doonamis_user
DB_PASSWORD=doonamis_pass
```

### 4. Levanta los contenedores

Desde la raíz del proyecto:

```sh
docker compose up --build
```

Esto descargará las imágenes necesarias, construirá los servicios y levantará todo el entorno.

---

## Acceso a los servicios

- **Frontend (Angular):**  
  [http://localhost](http://localhost)

- **Backend (Laravel):**  
  [http://localhost:8080](http://localhost:8080)

- **MySQL:**  
  - Host: `localhost`
  - Puerto: `3306`
  - Usuario: `doonamis_user`
  - Contraseña: `doonamis_pass`
  - Base de datos: `doonamis_db`

---

## Comandos útiles

- **Generar la clave de Laravel (solo la primera vez):**
  ```sh
  docker compose exec back php artisan key:generate
  ```

- **Ejecutar migraciones de Laravel:**
  ```sh
  docker compose exec back php artisan migrate
  ```

- **Acceder a MySQL desde el contenedor:**
  ```sh
  docker compose exec mysql mysql -u doonamis_user -p
  # Contraseña: doonamis_pass
  ```

---

## Notas

- Si cambias la configuración de Nginx, reinicia el servicio con:
  ```sh
  docker compose restart nginx
  ```
- Puedes acceder directamente al frontend en [http://localhost:4200](http://localhost:4200) y al backend en [http://localhost:8000](http://localhost:8000) si lo necesitas.

---

## Licencia

MIT