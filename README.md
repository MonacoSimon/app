# Notes App - Full Stack Implementation

Aplicación de gestión de notas desarrollada como parte del proceso de selección de Ensolvers. Implementa la Phase 1 (CRUD y Archivo) y Phase 2 (Categorías y Filtrado).

## Requisitos de Entorno
- **Python:** 3.12.3
- **Node.js:** v22.22.0
- **Gestor de paquetes:** npm
- **Base de Datos:** SQLite (Relacional via SQLAlchemy)

## Arquitectura y Tecnologías
La aplicación está construida como una **SPA (Single Page Application)** con total separación entre Frontend y Backend.

- **Backend (FastAPI):** Implementado con arquitectura de capas:
    - **Controllers/Routers:** Manejo de endpoints y validación.
    - **Services:** Lógica de negocio y manejo de errores.
    - **Repositories:** Abstracción de acceso a datos.
    - **Models/Schemas:** Definición de datos con SQLAlchemy y Pydantic.
- **Frontend (React):** Desarrollado con Vite y Bootstrap para un diseño responsive.

## Cómo ejecutar la aplicación
El proyecto incluye un script de automatización que configura el entorno virtual de Python, instala las dependencias de ambos proyectos y lanza los servidores simultáneamente.

```bash
chmod +x instalacion.sh
./instalacion.sh
