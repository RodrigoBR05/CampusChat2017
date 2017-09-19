/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res, next){
  	sails.log('Estoy en el index');
  	var usuarioActual = req.session.user;
  	console.log(usuarioActual);

    /*Las consultas a la BD se realizan tomando en consideración el rol del usuario que se autentica
      Rol de los usuarios:
        -->1-estudiante
        -->2-administrador
        -->3-profesor
        -->5-encargado del estudiante
    */

  	var queryCompanieros = 'SELECT '
                      +' s2.id idCompaniero, s2.name nombreCompaniero, s2.last_name apellido1Companiero,'
                	  +' s2.last_name2 apellido2Companiero, s2.rol, s2.imagen'
                +' FROM'
                    +' (SELECT '
                       +' a.id_Usuario, b.id_Colegio, a.id_Curso, a.id_CursoEntidad, d.nombreProyecto, c.descripcion, b.codigo'
                	 +' FROM'
                       +' cloudcam_campus.cursosestudiantes a, cloudcam_campus.cursoentidad b, cloudcam_campus.cursos c, '
                       +' cloudcam_campus.administrativo d'
                     +' WHERE'
                	   +' a.id_Usuario = ?'
                	   +' AND a.id_CursoEntidad = b.id_CursoEntidad'
                       +' AND a.id_Curso = b.id_Curso'
                       +' AND b.id_CursoEntidadPadre = 0'
                       +' AND b.estado in (2,6)'
                       +' AND b.id_Colegio = c.id_Colegio'
                       +' AND b.id_Curso = c.id_Curso'
                       +' AND c.id_Colegio = d.id_Administrativo) s1, cloudcam_campus.si_user s2, cloudcam_campus.cursosestudiantes s3, '
                       +' cloudcam_campus.cursoentidad s4, cloudcam_campus.cursos s5'
                +' WHERE'
                    +' s2.id != ?'
                	  +' AND s1.id_Colegio = s2.institucionDefault'
                    +' AND s2.rol = 1'
                    +' and s2.enabled = 1'
                    +' AND s2.id = s3.id_Usuario'
                    +' AND s1.id_CursoEntidad = s3.id_CursoEntidad'
                    +' AND s1.id_Curso = s3.id_Curso'
                    +' AND s3.id_CursoEntidad = s4.id_CursoEntidad'
                    +' AND s3.id_Curso = s4.id_Curso'
                    +' AND s4.id_CursoEntidadPadre = 0'
                    +' AND s4.estado in (2,6)'
                    +' AND s4.id_Colegio = s5.id_Colegio'
                    +' AND s4.id_Curso = s5.id_Curso'
                    +' group by s2.id';


    if (usuarioActual.rol === 1) {
      /*Si es estudiante muestra a los compañeros, profesores y grupos*/
      Si_user.query(queryCompanieros, [usuarioActual.id, usuarioActual.id] ,function(err, rawResult) {
        if (err) { return res.serverError(err); }

        res.view({
          rawResult : rawResult
        });

      });
      
    }

  }
};