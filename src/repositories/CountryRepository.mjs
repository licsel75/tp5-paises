import Country from '../models/Country.mjs';
import IRepository from './IRepository.mjs';

class CountryRepository extends IRepository {
    
// CountryRepository.mjs

async obtenerTodos() {
    return await Country.find({ 
        creador: "Salim",
        tipoDocumento: "pais"
    });
}

async obtenerPorId(id) {
    return await Country.findOne({ 
        _id: id, 
        creador: "Salim",
        tipoDocumento: "pais"
    });
}

async crear(data) {
    data.creador = "Salim";
    data.tipoDocumento = "pais";
    const nuevoPais = new Country(data);
    return await nuevoPais.save();
}

async actualizar(id, data) {
    delete data.creador;
    delete data.tipoDocumento;
    return await Country.findOneAndUpdate(
        { _id: id, creador: "Salim", tipoDocumento: "pais" },
        data,
        { new: true }
    );
}

async eliminarPorId(id) {
    return await Country.findOneAndDelete({ 
        _id: id, 
        creador: "Salim",
        tipoDocumento: "pais"
    });
}



}

// Exportar una única instancia (singleton)
export default new CountryRepository();