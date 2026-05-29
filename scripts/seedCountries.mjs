import axios from 'axios';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/dbConfig.mjs';
import Country from '../src/models/Country.mjs';

dotenv.config();
await connectDB();

// ==========================================
//  OBTENER PAÍSES DESDE LA API
// =============================
const obtenerPaisesDesdeAPI = async () => {
    try {
        const respuesta = await axios.get('https://restcountries.com/v3.1/region/america');
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error.message);
        process.exit(1);
    }
};

// ==================
//  FILTRAR PAÍSES QUE HABLAN ESPAÑOL
// ==========================================
const filtrarPorIdiomaEspanol = (paises) => {
    return paises.filter(pais => {
        return pais.languages && pais.languages.spa === 'Spanish';
    });
};

// ================================
//  LIMPIAR Y TRANSFORMAR DATOS PERMITIA 1 'Nombre no disponible'
// ==========================================
// const limpiarDatosPais = (pais) => {
//     // Procesar GINI: calcular promedio de todos los años disponibles
//     let valorGini = null;
//     if (pais.gini && typeof pais.gini === 'object') {
//         const años = Object.keys(pais.gini);
//         if (años.length > 0) {
//             let suma = 0;
//             let contador = 0;
//             for (const año of años) {
//                 const valor = pais.gini[año];
//                 if (typeof valor === 'number') {
//                     suma += valor;
//                     contador++;
//                 }
//             }
//             if (contador > 0) {
//                 valorGini = parseFloat((suma / contador).toFixed(1));
//             }
//         }
//     }

//     return {
//         name: {
//             official: pais.name?.official || 'Nombre no disponible'
//         },
//         capital: pais.capital || [],
//         borders: pais.borders || [],
//         area: pais.area || 0,
//         population: pais.population || 0,
//         gini: valorGini,
//         timezones: pais.timezones || [],
//         creador: "Salim",
//         tipoDocumento: "pais"
//     };
// };

// ================================
// LIMPIAR Y TRANSFORMAR DATOS , NO PERMITE NI UN 'Nombre no disponible'
// ==========================================

const limpiarDatosPais = (pais) => {
    // VERIFICAR QUE EL NOMBRE EXISTA
    const nombreOficial = pais.name?.official;
    if (!nombreOficial || nombreOficial === '') {
        console.warn(` País sin nombre oficial omitido:`, pais.name);
        return null;
    }

    // Procesar GINI...
    let valorGini = null;
    if (pais.gini && typeof pais.gini === 'object') {
        const años = Object.keys(pais.gini);
        if (años.length > 0) {
            let suma = 0;
            let contador = 0;
            for (const año of años) {
                const valor = pais.gini[año];
                if (typeof valor === 'number') {
                    suma += valor;
                    contador++;
                }
            }
            if (contador > 0) {
                valorGini = parseFloat((suma / contador).toFixed(1));
            }
        }
    }

    return {
        name: { official: nombreOficial },
        capital: pais.capital || [],
        borders: pais.borders || [],
        area: pais.area || 0,
        population: pais.population || 0,
        gini: valorGini,
        timezones: pais.timezones || [],
        creador: "Salim",
        tipoDocumento: "pais"
    };
};




// ==========================================
// 4. GUARDAR PAÍSES EN MONGODB (SIN DUPLICADOS)
// ===================================
const guardarPaisesEnDB = async (paises) => {
    let guardados = 0;
    let omitidos = 0;

    for (const pais of paises) {
        const existe = await Country.findOne({
            'name.official': pais.name.official,
            creador: "Salim",
            tipoDocumento: "pais"
        });

        if (!existe) {
            await Country.create(pais);
            console.log(`Guardado: ${pais.name.official}`);
            guardados++;
        } else {
            console.log(`Omitido (ya existe): ${pais.name.official}`);
            omitidos++;
        }
    }

    console.log(`\nResumen: ${guardados} paises guardados, ${omitidos} duplicados omitidos.`);
};

// ========================
// 5. FUNCIÓN QUE INVOCA EN ORDEN A LAS ANTERIORES
// ==========================================
const ejecutarSeed = async () => {
    console.log('Iniciando proceso de seed...\n');

    console.log('Obteniendo paises de America...');
    const todosLosPaises = await obtenerPaisesDesdeAPI(); //todos los paises que contine la API
    console.log(`Se obtuvieron ${todosLosPaises.length} paises de America.\n`);

    console.log('Filtrando paises que hablan español...');
    const paisesHispanohablantes = filtrarPorIdiomaEspanol(todosLosPaises); // ya tengo los paises hispanohablantes
    console.log(`Paises hispanohablantes: ${paisesHispanohablantes.length}\n`);

    //LIMPIAR PAISES
    console.log('Limpiando y transformando datos...');
    const paisesLimpios = paisesHispanohablantes.map(limpiarDatosPais).filter(pais => pais !== null);
    console.log(`Paises limpios (con nombre válido): ${paisesLimpios.length}\n`);

    console.log('Guardando en MongoDB (coleccion Grupo-15)...');
    await guardarPaisesEnDB(paisesLimpios);

    console.log('\nSeed completado exitosamente.');
    process.exit(0);
};

ejecutarSeed(); // INVOCACIÓN DE LA FUNCION PRINCIPAL