// validation.js

// Asegúrate de estar en la base de datos correcta (opcional si lo corres desde Compass/Atlas shell)
// use GlobalMarketDB; 

//CUSTOMERS COLECCION 
db.runCommand({
  collMod: "customers", // Nombre exacto de tu colección
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'Customer ID', // Al tener espacios, LLEVA COMILLAS OBLIGATORIAS
        'Customer Name'
      ],
      properties: {
        'Customer ID': {
          bsonType: 'string'
        },
        'Customer Name': {
          bsonType: 'string'
        },
        Segment: {
          bsonType: 'string'
        },
        address: {
          bsonType: 'object',
          properties: {
            city: {
              bsonType: 'string'
            },
            state: {
              bsonType: 'string'
            },
            country: {
              bsonType: 'string'
            },
            postalCode: {
              // Aceptamos string o int porque los CSV a veces traen basura
              bsonType: ['string', 'int'] 
            },
            market: {
              bsonType: 'string'
            },
            region: {
              bsonType: 'string'
            }
          }
        }
      }
    }
  },
  validationLevel: "moderate", // "strict" aplica a todo, "moderate" ignora documentos viejos inválidos
  validationAction: "error"    // "error" bloquea inserts inválidos, "warn" solo avisa
});

print("Validación aplicada correctamente a la colección customers.");

// Validación para la colección 'orders'
db.runCommand({
  collMod: "orders", 
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'orderId',
        'orderDate',
        'customerId',
        'productId',
        'sales',
        'quantity'
      ],
      properties: {
        orderId: {
          bsonType: 'string'
        },
        orderDate: {
          bsonType: 'date'
        },
        shipDate: {
          bsonType: 'date'
        },
        customerId: {
          bsonType: 'string'
        },
        productId: {
          bsonType: 'string'
        },
        sales: {
          bsonType: ['double', 'int', 'decimal'],
          minimum: 0
        },
        quantity: {
          bsonType: ['int', 'long'],
          minimum: 1
        },
        discount: {
          bsonType: ['double', 'int', 'decimal'],
          minimum: 0
        },
        profit: {
          bsonType: ['double', 'int', 'decimal']
        },
        shippingCost: {
          bsonType: ['double', 'int', 'decimal'],
          minimum: 0
        },
        orderPriority: {
          bsonType: 'string'
        },
        shipMode: {
          bsonType: 'string'
        }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

print("Validación aplicada correctamente a Órdenes.");


// Validación para la colección 'products'
db.runCommand({
  collMod: "products", 
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'productId',
        'name'
      ],
      properties: {
        productId: {
          bsonType: 'string'
        },
        name: {
          bsonType: 'string'
        },
        category: {
          bsonType: 'string'
        },
        subCategory: {
          bsonType: 'string'
        },
        reviews: {
          bsonType: 'array', // Validamos que sea un arreglo
          items: {
            bsonType: 'object', // Validamos cada objeto dentro del arreglo
            required: ['customerId', 'rating'],
            properties: {
              customerId: {
                bsonType: 'string'
              },
              rating: {
                bsonType: 'int',
                minimum: 1,
                maximum: 5,
                description: "El rating debe ser un entero entre 1 y 5"
              },
              comment: {
                bsonType: 'string'
              },
              createdAt: {
                bsonType: 'date'
              }
            }
          }
        }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

print("Validación aplicada correctamente a Productos.");