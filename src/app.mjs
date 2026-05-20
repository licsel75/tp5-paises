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

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// CONFIGURACIÓN EJS + LAYOUTS
// ==========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// ==========================================
// CONEXIÓN A MONGODB
// ==========================================
connectDB();

// ==========================================
// RUTAS
// ==========================================
app.use('/paises', countriesRoutes);

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