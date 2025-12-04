/**
 * PROYECTO: GlobalMarket Analytics & Search Engine
 * ARCHIVO: queries.js
 * DESCRIPCION: Scripts de consultas de agregación
 */

// use GlobalMarketDB; // Descomentar si es necesario seleccionar la BD

print("===================================================");
print("INICIANDO EJECUCIÓN DE CONSULTAS");
print("===================================================");

/**
 * [cite_start]1. REPORTE DE VENTAS [cite: 32]
 * Lógica: Filtra por fecha, une con productos y agrupa por categoría/año/mes.
 */
print("\n--- 1. Reporte de Ventas (Agrupado por Categoría y Fecha) ---");

var ventasReporte = db.orders.aggregate(
  [
    {
      $match: {
        orderDate: {
          $gte: ISODate('2013-03-01T00:00:00.000Z'),
          $lte: ISODate('2013-07-31T23:59:59.000Z')
        }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: 'productId',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: {
          category: '$product.category',
          // Usamos operadores de fecha nativos para BSON Date
          year: { $year: '$orderDate' }, 
          month: { $month: '$orderDate' }
        },
        totalVentas: { $sum: '$sales' },
        productos: {
          $addToSet: {
            productId: '$product.productId',
            name: '$product.name'
          }
        }
      }
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.category': 1
      }
    },
    {
      $project: {
        _id: 0,
        categoria: '$_id.category',
        anio: '$_id.year',
        mes: '$_id.month',
        totalVentas: 1,
        productos: 1
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
).toArray();

printjson(ventasReporte);


/**
 * [cite_start]2. BUCKET PATTERN (RANGOS DE PRECIOS) [cite: 34]
 * Lógica: Agrupa productos en rangos (Bajo, Medio, Alto) según su unitPrice.
 */
print("\n--- 2. Segmentación de Productos por Precio (Bucket) ---");

var bucketReporte = db.products.aggregate(
  [
    // Asegúrate que el campo se llame 'unitPrice' en tu colección. 
    // Si se llama 'price', cambia 'unitPrice' por 'price' aquí abajo.
    { $sort: { unitPrice: 1 } },
    {
      $bucket: {
        groupBy: '$unitPrice',
        boundaries: [0, 50, 150, 1000000],
        default: 'Sin rango',
        output: {
          rangoPrecio: { $first: 'TEMP' }, // Valor temporal para el switch posterior
          productos: {
            $push: {
              productId: '$productId',
              name: '$name',
              unitPrice: '$unitPrice'
            }
          }
        }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        rangoPrecio: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$_id', 0] },
                then: 'Bajo'
              },
              {
                case: { $eq: ['$_id', 50] },
                then: 'Medio'
              },
              {
                case: { $eq: ['$_id', 150] },
                then: 'Alto'
              }
            ],
            default: 'Otro'
          }
        },
        productos: 1,
        _id: 0
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
).toArray();

printjson(bucketReporte);


/**
 * [cite_start]3. TOP PRODUCTOS [cite: 33]
 * Lógica: Productos con >50 reviews ordenados por calificación promedio.
 */
print("\n--- 3. Top Productos Mejor Calificados ---");

var topProductosReporte = db.products.aggregate(
  [
    {
      $addFields: {
        // Manejo seguro por si un producto no tiene reviews
        reviewsCount: { 
            $size: { $ifNull: ['$reviews', []] } 
        },
        avgRating: { 
            $avg: '$reviews.rating' 
        }
      }
    },
    // NOTA: Si no te salen datos, baja este 50 a 0 o 1 para probar
    { $match: { reviewsCount: { $gte: 50 } } },
    {
      $sort: { avgRating: -1, reviewsCount: -1 }
    },
    { $limit: 20 },
    {
      $project: {
        _id: 0,
        productId: 1,
        name: 1,
        category: 1,
        reviewsCount: 1,
        avgRating: { $round: ['$avgRating', 1] } // Redondeo para mejor lectura
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
).toArray();

printjson(topProductosReporte);

print("===================================================");
print("FIN DE CONSULTAS");
print("===================================================");