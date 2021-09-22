const opcionesGet = (req, res, next) => {

    if (req.method === 'GET') {

        req.queryMatch = {
            blnActivo: true
        };

        req.paginacion = {
            count: {},
            mongoose: {},
            aggregate: [],
            facet: [],
            existe: false
        };

        if (req.query.desde && req.query.hasta) {
            req.paginacion.existe = true;
            skip = Number((req.query.desde - 1) <= 0 ? 0 : (req.query.desde - 1));
            limit = Number(req.query.hasta - skip);
            req.paginacion.aggregate = [{ $skip: skip }, { $limit: limit }];
            req.paginacion.mongoose = { skip, limit };
            req.paginacion.facet = [{
                $facet: {
                    totalItems: [{ $count: 'count' }],
                    resultados: [{ $skip: skip }, { $limit: limit }]
                }
            }];
        }

        if (req.query.mostrarDesactivados) {
            if (req.query.mostrarDesactivados != 'false' && req.query.mostrarDesactivados != 'true') {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'No se recibió un valor booleano en el parámetro mostrarDesactivados.',
                    cont: {
                        mostrarDesactivados: req.query.mostrarDesactivados || null
                    }
                });
            }

            if (req.query.mostrarDesactivados === 'true') {
                delete req.queryMatch.blnActivo;
            }
        }
    }

    next();
};

module.exports = opcionesGet;