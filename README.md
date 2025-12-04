# GlobalMarket Analytics & Search Engine 🚀

**Universidad Nacional Experimental de Guayana (UNEG)** **Asignatura:** Sistemas de Bases de Datos II (NoSQL / MongoDB)  
**Semestre:** 2025-II  

Este proyecto consiste en la migración, optimización y análisis de datos para "GlobalMarket", una plataforma de E-commerce. Se implementa una arquitectura documental en **MongoDB Atlas**, utilizando Aggregation Framework para inteligencia de negocios, Atlas Search para búsquedas avanzadas y Schema Validation para integridad de datos.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Carga de Datos](#instalación-y-carga-de-datos)
4. [Configuración de Índices y Search](#configuración-de-índices-y-search)
5. [Ejecución de Scripts](#ejecución-de-scripts)
6. [Dashboard y Visualización](#dashboard-y-visualización)

---

## Requisitos Previos

* Cuenta en **MongoDB Atlas** (Cluster M0 Free Tier).
* **MongoDB Compass** instalado.
* Dataset de E-commerce (Archivos CSV/JSON de `orders`, `products`, `customers`).

---

## Estructura del Proyecto

```text
/
├── queries.js       # Pipelines de agregación (Reportes, Top Productos, Buckets)
├── validation.js    # Reglas de validación de esquema (JSON Schema)
├── README.md        # Documentación del proyecto
└── /dataset         # Archivos fuente (opcional si se entrega el link)

Instalación y Carga de Datos
1. Conexión al Cluster
Obtenga su Connection String de MongoDB Atlas y conéctese utilizando MongoDB Compass o mongosh.

2. Importación de Datos
Debe crear una base de datos llamada GlobalMarketDB e importar las siguientes colecciones:

products: Catálogo de productos.

orders: Histórico de transacciones (o sales).

customers: Información de clientes.

Nota: Puede usar mongoimport o la interfaz gráfica de Compass (Botón "Import Data"). Asegúrese de seleccionar los tipos de datos correctos (ej. Double para precios, Date para fechas).

Configuración de Índices y Search
Para que las consultas funcionen correctamente, debe configurar los índices en Atlas.

1. Atlas Search (Búsqueda Difusa)
Para habilitar la búsqueda "Fuzzy" en productos:

En Atlas, vaya a la colección products -> Pestaña Search.

Haga clic en Create Search Index -> JSON Editor.

Use el nombre default y la siguiente configuración:

JSON
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": { "type": "string" }
    }
  }
}

2. Índices de Rendimiento
Para optimizar las agregaciones, ejecute en la consola:


// Índice compuesto para acelerar el filtrado por categoría y precio
db.products.createIndex({ category: 1, unitPrice: 1 });

Ejecución de Scripts

1. Aplicar Validaciones (validation.js)
Este script asegura la integridad de los datos (ej. precios positivos, correos válidos).

Abra el archivo validation.js en MongoDB Compass (Pestaña Mongosh en la parte inferior) o en su terminal.

Ejecute todo el contenido. Verá un mensaje de confirmación: "Validación aplicada correctamente...".

2. Generar Reportes (queries.js)
Este archivo contiene los 3 pipelines de agregación requeridos:

Reporte de Ventas: Ingresos agrupados por Categoría y Mes.

Bucket Pattern: Segmentación de productos por rangos de precio.

Top Productos: Productos con mejor rating (>50 reviews).

Cómo ejecutar: Copie el contenido de queries.js y péguelo en la consola Mongosh. Los resultados se imprimirán en formato JSON en la pantalla.
