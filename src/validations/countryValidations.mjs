import { body, validationResult } from 'express-validator';

export const validateCountry = [
    // name.official
    body('name.official')
        .notEmpty().withMessage('El nombre oficial es obligatorio')
        .isLength({ min: 3, max: 90 }).withMessage('El nombre debe tener entre 3 y 90 caracteres')
        .trim(),
    
    // area
    body('area')
        .notEmpty().withMessage('El área es obligatoria')
        .isFloat({ min: 0 }).withMessage('El área debe ser un número positivo'),
    
    // population
    body('population')
        .notEmpty().withMessage('La población es obligatoria')
        .isInt({ min: 0 }).withMessage('La población debe ser un número entero positivo'),
    
    // Middleware que verifica errores (por ahora devuelve JSON)
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Errores de validación:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];