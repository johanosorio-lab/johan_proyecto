const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    res.render('index', {
        nombrePagina : 'Panel de Control de Stock',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Registro de Stock',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    // validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];

    if(!nombre) {
        errores.push({'texto': 'Asigna un nombre al registro'})
    }

    // si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Registro de Stock',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url, 
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    if(!proyecto) return next();

    // Consultar tareas del Proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });

    // render a la vista
    res.render('tareas', {
        nombrePagina : 'Detalles del Lote',
        proyecto,
        proyectos, 
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id, 
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Actualizar Registro de Stock',
        proyectos,
        proyecto
    })
}



exports.actualizarProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    // validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];

    if(!nombre) {
        errores.push({'texto': 'Asigna un nombre al registro'})
    }

    // si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Registro de Stock',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id }} 
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    // console.log(req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url : urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('Registro Eliminado Correctamente');
}