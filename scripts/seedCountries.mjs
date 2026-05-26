import axios from 'axios';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/dbConfig.mjs';
import Country from '../src/models/Country.mjs';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
await connectDB();

// ==========================================
// 1. FUNCIÓN: Obtener países desde la API
// ==========================================
const fetchCountries = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/region/america');
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error.message);
        process.exit(1);
    }
};

// ==========================================
// 2. FUNCIÓN: Filtrar países que hablan español
// ==========================================
const filterSpanishSpeaking = (countries) => {
    return countries.filter(country => {
        return country.languages && country.languages.spa;
    });
};

// ==========================================
// 3. FUNCIÓN: Limpiar propiedades y agregar datos necesarios
// ==========================================
// const cleanCountryData = (country) => {
    // Procesar GINI: la API devuelve { "2016": 31.9 }, tomamos el primer valor
    // let giniValue = null;
    // if (country.gini && typeof country.gini === 'object') {
    //     const years = Object.keys(country.gini);
    //     if (years.length > 0) {
    //         giniValue = country.gini[years[0]];
    //     }
    // }
const cleanCountryData = (country) => {
    // para procesar GINI: scamos promedio
    let giniValue = null;
if (country.gini && typeof country.gini === 'object') {
    const years = Object.keys(country.gini);
    if (years.length > 0) {
        let sum = 0;
        let count = 0;
        for (const year of years) {
            const value = country.gini[year];
            if (typeof value === 'number') {
                sum += value;
                count++;
            }
        }
        if (count > 0) {
            giniValue = parseFloat((sum / count).toFixed(1));
        }
    }
}

    return {
        name: {
            official: country.name?.official || 'Nombre no disponible'
        },
        capital: country.capital || [],
        borders: country.borders || [],
        area: country.area || 0,
        population: country.population || 0,
        gini: giniValue,
        timezones: country.timezones || [],
        // ==========================================
        // CAMPOS CLAVE PARA COLECCIÓN COMPARTIDA
        // ==========================================
        creador: "Salim",
        tipoDocumento: "pais"
    };
};

// ==========================================
// 4. FUNCIÓN: Guardar países en MongoDB (sin duplicados)
// ==========================================
const saveCountries = async (countries) => {
    let savedCount = 0;
    let skippedCount = 0;

    for (const country of countries) {
        // Buscar si ya existe un país con el mismo nombre oficial, mismo creador y mismo tipoDocumento
        const exists = await Country.findOne({
            'name.official': country.name.official,
            creador: "Salim",
            tipoDocumento: "pais"
        });

        if (!exists) {
            await Country.create(country);
            console.log(`✅ Guardado: ${country.name.official}`);
            savedCount++;
        } else {
            console.log(`⏭️ Saltado (ya existe): ${country.name.official}`);
            skippedCount++;
        }
    }

    console.log(`\n📊 Resumen: ${savedCount} países guardados, ${skippedCount} duplicados omitidos.`);
};

// ==========================================
// 5. FUNCIÓN PRINCIPAL
// ==========================================
const seedDatabase = async () => {
    console.log('🔄 Iniciando proceso de seed...\n');

    // Paso 1: Obtener países de la API
    console.log('📡 Obteniendo países de América...');
    const allCountries = await fetchCountries();
    console.log(`✅ Se obtuvieron ${allCountries.length} países de América.\n`);

    // Paso 2: Filtrar por idioma español
    console.log('🔍 Filtrando países que hablan español...');
    const spanishCountries = filterSpanishSpeaking(allCountries);
    console.log(`✅ Países hispanohablantes: ${spanishCountries.length}\n`);

    // Paso 3: Limpiar datos
    console.log('🧹 Limpiando y transformando datos...');
    const cleanedCountries = spanishCountries.map(cleanCountryData);
    console.log(`✅ Datos limpios listos.\n`);

    // Paso 4: Guardar en MongoDB
    console.log('💾 Guardando en MongoDB (colección Grupo-15)...');
    await saveCountries(cleanedCountries);

    console.log('\n🎉 ¡Seed completado exitosamente!');
    process.exit(0);
};

// Ejecutar el seed
seedDatabase();