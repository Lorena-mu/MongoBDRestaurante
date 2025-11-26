/***************************************
 * MONGO DB SCRIPTS - RESTAURANTE
 * Autor: Lorena Muñoz y Wilson Rubiano 
 ***************************************/

/***************************************
 * 1CREACIÓN DE COLECCIONES
 ***************************************/

// Colección: clientes
db.createCollection("clientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "telefono", "email", "direccion"],
      properties: {
        nombre: { bsonType: "string" },
        telefono: { bsonType: "string" },
        email: { bsonType: "string" },
        direccion: { bsonType: "string" }
      }
    }
  }
});

// Colección: productos
db.createCollection("productos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "categoriaId", "precio", "descripcion", "disponibilidad"],
      properties: {
        nombre: { bsonType: "string" },
        categoriaId: { bsonType: "objectId" },
        precio: { bsonType: "number" },
        descripcion: { bsonType: "string" },
        disponibilidad: { bsonType: "bool" }
      }
    }
  }
});

// Colección: pedidos
db.createCollection("pedidos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "clienteId", "fecha", "estado", "tipo",
        "subtotal", "impuestos", "totalPedido", "productos"
      ],
      properties: {
        clienteId: { bsonType: "objectId" },
        fecha: { bsonType: "date" },
        estado: { bsonType: "string" },
        mesa: { bsonType: ["int", "null"] },
        tipo: { bsonType: "string" },
        subtotal: { bsonType: "number" },
        impuestos: { bsonType: "number" },
        totalPedido: { bsonType: "number" },
        productos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["productoId", "nombre", "cantidad", "precioUnitario", "total"],
            properties: {
              productoId: { bsonType: "objectId" },
              nombre: { bsonType: "string" },
              cantidad: { bsonType: "int" },
              precioUnitario: { bsonType: "number" },
              total: { bsonType: "number" }
            }
          }
        }
      }
    }
  }
});

// Colección: empleados
db.createCollection("empleados", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre_apellido","documento","telefono","correo","cargo","turno","fecha_ingreso","estado"],
      properties: {
        nombre_apellido: { bsonType: "string" },
        documento: { bsonType: "string" },
        telefono: { bsonType: "string" },
        correo: { bsonType: "string" },
        cargo: { bsonType: "string" },
        turno: { bsonType: "string" },
        fecha_ingreso: { bsonType: "date" },
        estado: { bsonType: "string" }
      }
    }
  }
});

// Colección: categorias
db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "descripcion", "estado"],
      properties: {
        nombre: { bsonType: "string", description: "Debe ser un string" },
        descripcion: { bsonType: "string", description: "Debe ser un string" },
        estado: { bsonType: "string", enum: ["activa","inactiva"], description: "activa|inactiva" }
      }
    }
  },
  validationLevel: "strict"
});


/***************************************
 * 2INSERCIÓN DE DATOS DE PRUEBA
 ***************************************/

// Clientes
const nombres = ["Ana", "Luis", "Carlos", "María", "Pedro", "Lucía", "Jorge", "Camila", "Sofía", "Andrés"];
const apellidos = ["Gómez", "Rodríguez", "Martínez", "López", "Pérez", "Hernández", "Morales", "Ruiz", "Torres", "Romero"];

let clientes = [];
for (let i = 0; i < 100; i++) {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)] + " " +
                 apellidos[Math.floor(Math.random() * apellidos.length)];
  clientes.push({
    nombre: nombre,
    telefono: "320" + Math.floor(1000000 + Math.random() * 8999999),
    email: nombre.toLowerCase().replace(" ", ".") + "@gmail.com",
    direccion: "Calle " + (Math.floor(Math.random() * 50) + 1) + " # " + (Math.floor(Math.random() * 30) + 1)
  });
}
db.clientes.insertMany(clientes);

// Categorías
db.categorias.insertMany([
  { nombre: "Bebidas", descripcion: "Bebidas frías y calientes", estado: "activa" },
  { nombre: "Postres", descripcion: "Dulces tradicionales y modernos", estado: "activa" },
  { nombre: "Entradas", descripcion: "Platos ligeros", estado: "activa" },
  { nombre: "Platos fuertes", descripcion: "Platos principales del menú", estado: "activa" },
  { nombre: "Hamburguesas", descripcion: "Variedad de hamburguesas", estado: "activa" },
  { nombre: "Ensaladas", descripcion: "Ensaladas saludables", estado: "activa" },
  { nombre: "Sopas", descripcion: "Sopas del día", estado: "inactiva" },
  { nombre: "Pizzas", descripcion: "Distintos tipos de pizza", estado: "activa" },
  { nombre: "Pastas", descripcion: "Platos de pasta", estado: "activa" },
  { nombre: "Infantil", descripcion: "Menú para niños", estado: "activa" }
]);

// Empleados
const cargos = ["Mesero", "Cocinero", "Administrador", "Domiciliario", "Cajero"];
const turnos = ["mañana", "tarde", "noche"];

let empleados = [];
for (let i = 0; i < 100; i++) {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)] + " " +
                 apellidos[Math.floor(Math.random() * apellidos.length)];
  empleados.push({
    nombre_apellido: nombre,
    documento: "" + Math.floor(10000000 + Math.random() * 90000000),
    telefono: "311" + Math.floor(1000000 + Math.random() * 8999999),
    correo: nombre.toLowerCase().replace(" ", ".") + "@restaurante.com",
    cargo: cargos[Math.floor(Math.random() * cargos.length)],
    turno: turnos[Math.floor(Math.random() * turnos.length)],
    fecha_ingreso: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    estado: Math.random() > 0.1 ? "activo" : "vacaciones"
  });
}
db.empleados.insertMany(empleados);


/***************************************
 * 3INSERCIÓN DE DOCUMENTOS INDIVIDUALES
 ***************************************/
db.clientes.insertOne({
  nombre: "Ana Rodríguez",
  telefono: "3204567890",
  email: "ana@gmail.com",
  direccion: "Calle 10 # 4-22"
});

db.productos.insertOne({
  nombre: "Hamburguesa Especial",
  descripcion: "Carne angus con queso cheddar",
  precio: 28000,
  categoriaId: ObjectId("64cfe3a32145fb900a123456")
});

db.pedidos.insertOne({
  clienteId: ObjectId("64d0f143789abcd036112233"),
  empleadoId: ObjectId("64d0f143789abcd049998888"),
  fecha: new Date(),
  estado: "pendiente",
  mesa: 5,
  tipo: "local",
  impuestos: 3000,
  subtotal: 28000,
  total: 31000,
  totalPedido: 1,
  productos: [
    {
      productoId: ObjectId("64da9012123abcd045ef7890"),
      nombre: "Hamburguesa Especial",
      cantidad: 1,
      precioUnitario: 28000
    }
  ]
});


/***************************************
 * 4CONSULTAS BÁSICAS
 ***************************************/

// Ver todos los clientes
db.clientes.find();

// Buscar clientes por nombre
db.clientes.find({ nombre: "Ana Rodríguez" });

// Buscar pedidos pendientes
db.pedidos.find({ estado: "pendiente" });


/***************************************
 * 5ACTUALIZACIÓN
 ***************************************/
db.clientes.updateOne(
  { email: "ana@gmail.com" },
  { $set: { telefono: "3001234567" } }
);

db.pedidos.updateOne(
  { _id: ObjectId("64dbf921ab12cd3400011222") },
  { $set: { estado: "entregado" } }
);


/***************************************
 * 6ELIMINACIÓN
 ***************************************/
db.clientes.deleteOne({ email: "ana@gmail.com" });
db.productos.deleteOne({ nombre: "Hamburguesa Especial" });


/***************************************
 * 7️⃣ CONSULTAS CON FILTROS Y OPERADORES
 ***************************************/
db.pedidos.find({ total: { $gt: 30000 } });
db.productos.find({ precio: { $gte: 10000, $lte: 20000 } });
db.clientes.find({ nombre: { $regex: /^A/i } });


/***************************************
 * 8CONSULTAS DE AGREGACIÓN (ESTADÍSTICAS)
 ***************************************/

// Sumar el total vendido
db.pedidos.aggregate([
  { $unwind: "$productos" },
  { $group: { _id: null, ventasTotales: { $sum: "$productos.total" } } }
]);

// Promedio de venta por pedido
db.pedidos.aggregate([
  { $group: { _id: null, promedioVenta: { $avg: "$totalPedido" } } }
]);

// Producto más vendido
db.pedidos.aggregate([
  { $unwind: "$productos" },
  { $group: { _id: "$productos.nombre", cantidadVendida: { $sum: "$productos.cantidad" } } },
  { $sort: { cantidadVendida: -1 } },
  { $limit: 1 }
]);
