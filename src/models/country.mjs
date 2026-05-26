import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: {
        official: {
            type: String,
            required: [true, 'El nombre oficial es obligatorio'],
            trim: true,
            minlength: [3, 'Mínimo 3 caracteres'],
            maxlength: [90, 'Máximo 90 caracteres']
        }
    },
    capital: {
        type: [String],
        default: []
    },
    borders: {
        type: [String],
        default: []
    },
    area: {
        type: Number,
        required: [true, 'El área es obligatoria'],
        min: [0, 'El área no puede ser negativa']
    },
    population: {
        type: Number,
        required: [true, 'La población es obligatoria'],
        min: [0, 'La población no puede ser negativa']
    },
    gini: {
        type: Number,
        default: null
    },
    timezones: {
        type: [String],
        default: []
    },
    // ==========================================
    // CAMPO CLAVE PARA TRABAJAR EN COLECCIÓN COMPARTIDA
    // ==========================================
    creador: {
        type: String,
        default: "Salim",  // mi nombre
        immutable: true      // no se puede modificar
    },
    tipoDocumento: {
        type: String,
        default: "pais",
        immutable: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// nombre de la colección 
//const SuperHero = mongoose.model('SuperHero', superHeroSchema, 'Grupo-15');

// Forzar el uso de la colección compartida "Grupo-15"
const Country = mongoose.model('Country', countrySchema, 'Grupo-15');

export default Country;