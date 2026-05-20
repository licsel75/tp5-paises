import * as countryService from '../services/countryService.mjs';

// ==========================================
// VISTAS (renderizan plantillas EJS)
// ==========================================

// Dashboard - listar todos los países
export const dashboardController = async (req, res) => {
    try {
        const countries = await countryService.getAllCountries();
        console.log('Países encontrados:', countries.length);  // ← AGREGAR
        res.render('dashboard', {
            titulo: 'Dashboard de Países Hispanohablantes',
            paises: countries
        });
    } catch (error) {
        console.error('Error en dashboard:', error);  // ← VER ESTO EN LA TERMINAL
        res.status(500).send('Error al cargar el dashboard: ' + error.message);
    }
};

// Mostrar formulario para AGREGAR
export const showAddFormController = (req, res) => {
    res.render('addCountry', {
        titulo: 'Agregar País',
        errores: null,
        datos: null
    });
};

// Mostrar formulario para EDITAR
export const showEditFormController = async (req, res) => {
    try {
        const { id } = req.params;
        const country = await countryService.getCountryById(id);
        res.render('editCountry', {
            titulo: 'Editar País',
            errores: null,
            pais: country
        });
    } catch (error) {
        console.error('Error en showEditForm:', error);
        res.status(404).send('País no encontrado');
    }
};

// ==========================================
// ACCIONES (procesan datos y redirigen)
// ==========================================

// Crear país (POST)
export const createCountryController = async (req, res) => {
    try {
        await countryService.createCountry(req.body);
        res.redirect('/paises/dashboard');
    } catch (error) {
        console.error('Error en create:', error);
        res.render('addCountry', {
            titulo: 'Agregar País',
            errores: [{ msg: error.message }],
            datos: req.body
        });
    }
};

// Actualizar país (PUT)
export const updateCountryController = async (req, res) => {
    try {
        const { id } = req.params;
        await countryService.updateCountry(id, req.body);
        res.redirect('/paises/dashboard');
    } catch (error) {
        console.error('Error en update:', error);
        res.status(404).send('Error al actualizar: ' + error.message);
    }
};

// Eliminar país (DELETE)
export const deleteCountryController = async (req, res) => {
    try {
        const { id } = req.params;
        await countryService.deleteCountry(id);
        res.status(200).json({ message: 'Eliminado correctamente' });
    } catch (error) {
        console.error('Error en delete:', error);
        res.status(500).json({ error: error.message });
    }
};