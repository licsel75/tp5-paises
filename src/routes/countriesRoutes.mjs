import express from 'express';
import {
    dashboardController,
    showAddFormController,
    createCountryController,
    showEditFormController,
    updateCountryController,
    deleteCountryController
} from '../controllers/countriesController.mjs';
import { validateCountry } from '../validations/countryValidations.mjs';

const router = express.Router();

// ==========================================
// RUTAS DEL DASHBOARD
// ==========================================
router.get('/dashboard', dashboardController);

// ==========================================
// RUTAS PARA AGREGAR
// ==========================================
router.get('/agregar', showAddFormController);
router.post('/agregar', validateCountry, createCountryController);

// ==========================================
// RUTAS PARA EDITAR
// ==========================================
router.get('/editar/:id', showEditFormController);
router.put('/editar/:id', validateCountry, updateCountryController);

// ==========================================
// RUTAS PARA ELIMINAR
// ==========================================
router.delete('/eliminar/:id', deleteCountryController);

// ==========================================
// REDIRECCIÓN PRINCIPAL
// ==========================================
router.get('/', (req, res) => {
    res.redirect('/paises/dashboard');
});

export default router;