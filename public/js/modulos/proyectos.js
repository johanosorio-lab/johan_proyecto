import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        // console.log(urlProyecto);
        Swal.fire({
            title: '¿Deseas eliminar este registro de stock?',
            text: "Un registro eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar', 
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                // enviar petición a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta);

                            Swal.fire(
                                'Registro Eliminado',
                                respuesta.data,
                                'success'
                            );

                            // redireccionar al inicio
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 3000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type:'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el registro'
                        })
                    })
            }
        })
    })
}
export default btnEliminar;