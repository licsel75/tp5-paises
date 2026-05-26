import countryRepository from '../repositories/CountryRepository.mjs';

// Obtener todos los países
export const getAllCountries = async () => {
    try {
        return await countryRepository.obtenerTodos();
    } catch (error) {
        throw new Error(`Error al obtener países: ${error.message}`);
    }
};

// Obtener país por ID
export const getCountryById = async (id) => {
    try {
        const country = await countryRepository.obtenerPorId(id);
        if (!country) throw new Error('País no encontrado');
        return country;
    } catch (error) {
        throw new Error(`Error al obtener país: ${error.message}`);
    }
};

// Crear un nuevo país
export const createCountry = async (data) => {
    try {
        return await countryRepository.crear(data);
    } catch (error) {
        throw new Error(`Error al crear país: ${error.message}`);
    }
};

// Actualizar un país
export const updateCountry = async (id, data) => {
    try {
        const country = await countryRepository.actualizar(id, data);
        if (!country) throw new Error('País no encontrado');
        return country;
    } catch (error) {
        throw new Error(`Error al actualizar país: ${error.message}`);
    }
};

// Eliminar un país
export const deleteCountry = async (id) => {
    try {
        const country = await countryRepository.eliminarPorId(id);
        if (!country) throw new Error('País no encontrado');
        return country;
    } catch (error) {
        throw new Error(`Error al eliminar país: ${error.message}`);
    }
};

// filtrar paises por nombre
export const buscarPorNombre = async (nombre) => {
    try {
        return await countryRepository.buscarPorNombre(nombre);
    } catch (error) {
        throw new Error(`Error al buscar países por nombre: ${error.message}`);
    }
};