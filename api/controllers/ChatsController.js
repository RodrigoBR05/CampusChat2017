/**
 * ChatsController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	 index: function(req, res, next){
	  	//sails.log('Estoy en el index');
	  	var usuarioActual = req.session.user;
	  	//console.log(usuarioActual);

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

	    var queryCursos = 'SELECT '
	                          +' a.id_Usuario,'
	                          +' b.id_Colegio idColegio,'
	                          +' a.id_Curso idNivel,'
	                          +' bh.id_CursoEntidad idSeccion,'
	                          +' a.id_CursoEntidad idCurso,'
	                          +' d.nombreProyecto nombreColegio,'
	                          +' descripcion nombreNivel,'
	                          +' b.codigo nombreClase,'
	                          +' b.id_Profesor'
	                        +' FROM'
	                          +' cursosestudiantes a'
	                          +' inner join cursoentidad b ON a.id_CursoEntidad = b.id_CursoEntidad'
	                          +' left outer join cursoentidad bh ON b.id_CursoEntidadPadre = bh.id_CursoEntidad'
	                          +' inner join cursos c ON b.id_Curso = c.id_Curso'
	                          +' inner join administrativo d ON c.id_Colegio = d.id_Administrativo'
	                        +' WHERE'
	                          +' a.id_Usuario = ?'
	                          +' AND b.estado in (2 , 6)';

        var queryChats = 'SELECT *'
							+' FROM chats c'
							+' WHERE'
							+' c.id_transmisor = ?'
							+' OR c.id_receptor = ?';


	    if (usuarioActual.rol === 1) {
	      /*Si es estudiante muestra a los compañeros, profesores y grupos*/

	      Si_user.query(queryCompanieros, [usuarioActual.id, usuarioActual.id] ,function(err, companierosResult) {
	        //Compañeros
	        if (err) { return res.serverError(err); }

	        Cursos.query(queryCursos, [usuarioActual.id] ,function(err, cursosResult) {
	          //Cursos
	          if (err) { return res.serverError(err); }

	          //Obtengo los chats de los cursos actuales del estudiante
	          /*	
	          var consultaQuery = "";
	          for(let cursoActual of cursosResult){
	          	consultaQuery = consultaQuery+"OR c.id_curso = "+cursoActual.idCurso+" ";
	          }  		
	          console.log(consultaQuery);
	          */

	          //Recopilo los chat individuales del usuario
	            Chats.find({
	                //Chats del usuario actual
	                or: [
	                    { id_transmisor:usuarioActual.id},
	                    { id_receptor:usuarioActual.id}
	                ]
	            ,sort: 'fecha_actualizacion DESC'}).populate('id_receptor').populate('id_transmisor').populate('messages').exec(function (err, chats){
	              if (err) {
	                return res.serverError(err);
	              }
	              if (!chats) {
	                return res.notFound('No existen registros de chats.');
	              }

	              //sails.log('Registro encontrado:', chats);
	              //return res.json(messages);

		            //Datos a la vista
		            res.view({
		              companieros : companierosResult,
		              cursos : cursosResult
		            });

		      });

	        });

	      });
	      
	    }

	  }
	
};

