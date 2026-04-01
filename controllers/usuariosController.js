const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res ) => {
    res.render('crearCuenta', {
        nombrePagina : 'Registro en Control de Inventario Pro'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Acceso a Control de Inventario Pro', 
        error
    })
}

exports.crearCuenta = async (req, res) => {
    // leer los datos
    const { email, password} = req.body;

    try {
        // crear el usuario
        await Usuarios.create({
            email, 
            password,
            activo: 1
        });

        // crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        }

        /* COMENTADO TEMPORALMENTE PARA EVITAR ERROR DE RED (DNS/MAILTRAP)
           Cuando soluciones tus problemas de conexión o configures Mailtrap, 
           puedes quitar los símbolos de comentario /* y */
        /*
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Control de Inventario Pro', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        });
        */
        
        // redirigir al usuario
        // Cambiamos el mensaje para que sepas que se saltó el correo
        req.flash('correcto', 'Registro exitoso. Activa el usuario en phpMyAdmin para loguearte.');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        let mensajesError = [];
        
        if (error.errors) {
            mensajesError = error.errors.map(err => err.message);
        } else {
            mensajesError.push('Hubo un error al procesar tu cuenta');
            console.error("DETALLE DEL ERROR:", error);
        }

        req.flash('error', mensajesError);
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Registro en Control de Inventario Pro', 
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    } else {
        usuario.activo = 1;
        await usuario.save();

        req.flash('correcto', 'Cuenta activada correctamente');
        res.redirect('/iniciar-sesion');
    }
}