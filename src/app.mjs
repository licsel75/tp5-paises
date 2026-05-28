import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import dotenv from 'dotenv';
import { connectDB } from './config/dbConfig.mjs';
import countriesRoutes from './routes/countriesRoutes.mjs';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ====================================================
// MIDDLEWARES
// ==========================================
app.use(express.json()); // Para entender peticiones con JSON (req.body)
app.use(express.urlencoded({ extended: true })); // Para entender formularios HTML
app.use(methodOverride('_method')); // Convierte POST con ?_method=PUT en PUT real
app.use(expressLayouts);// Activa el sistema de layouts (para que funcione layout.ejs)
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos (CSS, imágenes)


// ==========================================
// CONFIGURACIÓN EJS + LAYOUTS
// ==========================================
app.set('view engine', 'ejs'); // Le digo a Express que use EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Dónde están los archivos .ejs
app.set('layout', 'layout'); // Cuál es el layout base (layout.ejs)

// ==========================================
// CONEXIÓN A MONGODB
// ==========================================
connectDB();

// ==========================================
// RUTAS
// ==========================================
app.use('/paises', countriesRoutes); //acá usamos el enrutador

// Ruta principal
app.get('/', (req, res) => {
    res.render('landing', {
        titulo: 'Inicio - PaísesApp'
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); 