module.exports = (fields, term, blnFilter = true) => {

    if (!term) throw new Error('No se recibió un término de búsqueda.');

    if (!Array.isArray(fields)) throw new Error('No se recibió un array');

    if (fields.length <= 0) throw new Error('No se recibió un elemento en el array');

    let fieldsFilters = fields;
    let filter = [];
    for (const field of fieldsFilters) {
        if (field.split('.')[field.split('.').length - 1].substring(0, 3) != 'str') throw new Error('Sólo se pueden filtrar campos de tipo string.');
        filter.push(JSON.parse(`{"${field}": { "$regex": "${blnFilter ? '' : '^'}${term.replace(/[|\\{}()[\]^$+*?.]/g, '\\\\$&').replace(/-/g, '\\\\x2d')}${blnFilter ? '' : '$'}", "$options": "i" }}`));
    }

    return [...filter];
};