import { body, validationResult } from 'express-validator';
import Country from '../models/Country.mjs';//para validar si el pais existe 


export const validateCountry = [

body('name.official')
    .notEmpty().withMessage('El nombre oficial es obligatorio')
    .isLength({ min: 3, max: 90 }).withMessage('El nombre debe tener entre 3 y 90 caracteres')
    .trim()
    .custom(async (value, { req }) => {
        const isEditing = req.method === 'PUT';
        const currentId = req.params.id;
        
        const query = {
            'name.official': value,
            creador: 'Salim',
            tipoDocumento: 'pais'
        };
        
        // Si es edición, excluir el país actual de la búsqueda
        if (isEditing && currentId) {
            query._id = { $ne: currentId };
        }
        
        const existingCountry = await Country.findOne(query);
        
        if (existingCountry) {
            throw new Error(`El país "${value}" ya existe en la base de datos.`);
        }
        
        return true;
    }),



// capital: cada elemento 3-90 caracteres (OPCIONAL)
// body('capital')
//     .optional({ checkFalsy: true })
//     .customSanitizer(value => {
//         if (!value) return [];
//         if (typeof value === 'string') {
//             return value.split(',').map(c => c.trim());
//         }
//         return value;
//     })
//     .custom(value => {
//         if (!value || value.length === 0) return true;
//         for (const cap of value) {
//             if (cap.length < 3 || cap.length > 90) {
//                 throw new Error(`"${cap}" no es válido. Cada capital debe tener entre 3 y 90 caracteres.`);
//             }
//         }
//         return true;
//     }),






 // capital: cada elemento 3-90 caracteres (OBLIGATORIO)
body('capital')
    .notEmpty().withMessage('La capital es obligatoria') // obligatoria
    .customSanitizer(value => {
        if (!value) return [];
        if (typeof value === 'string') {
            return value.split(',').map(c => c.trim());
        }
        return value;
    })
    .custom(value => {
        if (value.length === 0) {
            throw new Error('Debe ingresar al menos una capital');
        }
        for (const cap of value) {
            if (cap.length < 3 || cap.length > 90) {
                throw new Error(`"${cap}" no es válido. Cada capital debe tener entre 3 y 90 caracteres.`);
            }
        }
        return true;
    }),






    
        // borders: cada código 3 letras mayúsculas
    body('borders')
        .optional()
        .customSanitizer(value => {
            if (!value) return [];
            if (typeof value === 'string') {
                return value.split(',').map(b => b.trim().toUpperCase());
            }
            return value;
        })
        .custom(value => {
            if (!value || value.length === 0) return true;
            for (const code of value) {
                if (!/^[A-Z]{3}$/.test(code)) {
                    throw new Error(`"${code}" no es válido. Cada código de border debe ser 3 letras mayúsculas (ej: ARG, BRA, USA).`);
                }
            }
            return true;
        }),
    
    body('area')
        .notEmpty().withMessage('El área es obligatoria')
        .isFloat({ min: 0 }).withMessage('El área debe ser un número positivo'),
    
    body('population')
        .notEmpty().withMessage('La población es obligatoria')
        .isInt({ min: 0 }).withMessage('La población debe ser un número entero positivo'),
    


        // gini: 0-100, opcional
    body('gini')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0, max: 100 }).withMessage('El GINI debe ser un número entre 0 y 100'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const isEditing = req.originalUrl.includes('editar');
            console.log('Errores de validación:', errors.array());
            
            // Función auxiliar para convertir a array
            const toArray = (value) => {
                if (!value) return [];
                if (Array.isArray(value)) return value;
                if (typeof value === 'string') return value.split(',').map(item => item.trim());
                return [value];
            };
            
            if (isEditing) {
                const id = req.params.id;
                
                const paisPreparado = {
                    _id: id,
                    name: {
                        official: req.body['name.official'] || ''
                    },
                    capital: toArray(req.body.capital),
                    borders: toArray(req.body.borders),
                    area: req.body.area,
                    population: req.body.population,
                    gini: req.body.gini
                };
                
                return res.render('editCountry', {
                    titulo: 'Editar País',
                    errores: errors.array(),
                    pais: paisPreparado
                });
            } else {
                return res.render('addCountry', {
                    titulo: 'Agregar País',
                    errores: errors.array(),
                    datos: req.body
                });
            }
        }
        next();
    }
];