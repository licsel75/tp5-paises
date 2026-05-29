# TP5 - Países Hispanohablantes 





##  Objetivos del proyecto

El objetivo fue desarrollar una aplicación web completa que:


- Consuma datos desde la API externa `restcountries.com` (región América).
- Filtre los países que tengan el español como idioma oficial.
- Limpie los datos eliminando propiedades innecesarias (translations, tld, cca2, etc.).
- Normalice el campo GINI (la API lo devuelve como objeto por año, se promediaron todos los años disponibles).
- Guarde los datos procesados en MongoDB Atlas (colección compartida `Grupo-15`).
- Ofrezca un CRUD completo (crear, leer, actualizar, eliminar) con validaciones backend.
- Muestre un dashboard con todos los campos del modelo y búsqueda por nombre.
- Tenga un diseño responsive con layout, navbar y footer.





##  Tecnologías que usé

 Tecnología y para qué sirvió 

 Node.js:  Correr JavaScript en el servidor 
 Express: Crear el servidor, manejar rutas y middlewares 
 MongoDB Atlas: Base de datos en la nube 
 Mongoose: Conectar Node con MongoDB, definir esquemas 
 EJS: Generar HTML dinámico desde el servidor 
 express-ejs-layouts: Tener un layout base (navbar + footer) 
 express-validator: Validar los datos antes de guardarlos 
 method-override: Poder usar PUT y DELETE desde formularios HTML 
 axios: Llamar a la API externa de países 
 dotenv: Manejar variables de entorno (como la conexión a MongoDB) 




##  Cómo ejecutar el proyecto

### 1. Clonar o descargar el proyecto
git clone <https://github.com/licsel75/tp5-paises>

# Abrir terminal y navegar la la carpeta tp5-paises
cd tp5-paises

# Instalamos dependencias
npm install


# Varaible de entorno
crear archivo .env y 
usar archivo .env.example con tu usario y contraseña par el mismo

# Para usar API extterna desde la terminal llenar nuestra base MongoDB Atlas
node scripts/seedCountries.mjs

# Iniciamos el servidor
node src/app.mjs

# Desde el navegador acceder a la siguiente dirección
http://localhost:3005




