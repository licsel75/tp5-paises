import * as countryService from '../services/countryService.mjs';

// ==========================================
// VISTAS (renderizan plantillas EJS)
// ==========================================

// Dashboard - listar todos los países (funciona perfecto)
// export const dashboardController = async (req, res) => {
//     try {
//         const countries = await countryService.getAllCountries();
//         console.log('Países encontrados:', countries.length);  // AGREGAR
//         res.render('dashboard', {
//             titulo: 'Dashboard de Países Hispanohablantes',
//             paises: countries
//         });
//     } catch (error) {
//         console.error('Error en dashboard:', error);  // VER ESTO EN LA TERMINAL
//         res.status(500).send('Error al cargar el dashboard: ' + error.message);
//     }
// };




// Dashboard - listar paises que cumplen con el filtrado variable 
// todos lospaises de esta aplicación pasan por un fltrado fijo, crador y tipoDocumento
export const dashboardController1 = async (req, res) => {
    try {
        // Leer el parámetro de búsqueda (si viene)
        const { nombre } = req.query;
        
        // Por ahora, seguimos trayendo todos los países (sin filtrar)
        const countries = await countryService.getAllCountries();
        
        // Determinar el título según si hay búsqueda o no
        const titulo = nombre 
            ? `Resultados para "${nombre}"` 
            : 'Dashboard de Países Hispanohablantes';
        
        res.render('dashboard', {
            titulo: titulo,
            paises: countries,
            busqueda: nombre || ''  // Para mantener el valor en el input
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).send('Error al cargar el dashboard');
    }
};


export const dashboardController = async (req, res) => {
    try {
        const { nombre } = req.query;
        
        let countries;
        
        if (nombre) {
            // Buscar países que coincidan con el nombre
            countries = await countryService.buscarPorNombre(nombre);
        } else {
            // Traer todos los países
            countries = await countryService.getAllCountries();
        }
        
        const titulo = nombre 
            ? `Resultados para "${nombre}"` 
            : 'Dashboard de Países Hispanohablantes';
        
        res.render('dashboard', {
            titulo: titulo,
            paises: countries,
            busqueda: nombre || ''
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).send('Error al cargar el dashboard');
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