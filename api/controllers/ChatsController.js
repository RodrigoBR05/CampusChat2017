/**
 * ChatsController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	  index: function(req, res, next){
	  	res.view();
	  },

	  chatsindex: function(req, res, next){
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

	    var socketId = sails.sockets.getId(req);
	    Chats.watch(req);

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

		//Debe existir socket
        if( ! req.isSocket) {
          return res.badRequest();
        } 


	    if (usuarioActual.rol === 1) {
	      /*Si es estudiante muestra a los compañeros, profesores y grupos*/

	      Si_user.query(queryCompanieros, [usuarioActual.id, usuarioActual.id] ,function(err, companierosResult) {
	        //Compañeros
	        if (err) { return res.serverError(err); }

	        Cursos.query(queryCursos, [usuarioActual.id] ,function(err, cursosResult) {
	          //Cursos
	          if (err) { return res.serverError(err); }

	          //Obtengo los chats de los cursos actuales del estudiante	
	          var cursosEstudiante=[];
	          for(cursoActual of cursosResult){
	          	cursosEstudiante = cursosEstudiante.concat([{ id_curso: cursoActual.idCurso}]);

              }  
              var queryOr = [{ id_transmisor:usuarioActual.id}, { id_receptor:usuarioActual.id}].concat(cursosEstudiante);
              //Chats del usuario actual
	          var findOr = { or: queryOr ,sort: 'fecha_actualizacion DESC'}; 
	          //console.log(findOr);

	          //Recopilo los chat individuales del usuario
	            Chats.find(findOr).populate('id_receptor').populate('id_transmisor').populate('id_curso').populate('messages').exec(function (err, chats){
	              if (err) {
	                return res.serverError(err);
	              }
	              if (!chats) {
	                return res.notFound('No existen registros de chats.');
	              }

	              //Unir los sockets a sus respectivos chats
	              for(chatActual of chats){
	              	//console.log(chatActual);

	              	//Suscripción al socket
		            sails.sockets.join(socketId, chatActual.nombre_chat,function(err){
		                if (err) {
		                    return res.serverError(err);
		                }
		                //console.log('Inscrito en la room'+chatActual.nombre_chat);
		            });
	              }

	              res.json({
				              companieros : companierosResult,
				              cursos : cursosResult,
				              chatsUsuario : chats
				            });

		      });

	        });

	      });
	      
	    }//if

	  },
	  create:function(req, res){
	  	//Crear los chats individuales o grupales
	    var socketId = sails.sockets.getId(req);
	    //console.log('Socket Post '+socketId);

		// Pruebas para recibir parametros
		var transmisor = req.param('id_transmisor');
		var receptor = req.param('id_receptor');
		var grupo = req.param('id_curso');
		var fechaActualizacion = new Date();
		var nombreChat;

		if (receptor) {

			Chats.findOne({
	            //Chats
	            or: [
	                { id_transmisor:transmisor, id_receptor:receptor},
                    { id_transmisor:receptor, id_receptor:transmisor}
	            ]
	        }).exec(function (err, chat){
	          if (err) {
	            return res.serverError(err);
	          }
	          if (!chat) {

	          	if(transmisor < receptor){
	        		nombreChat = 'campus_chat_user'+transmisor+'_user'+receptor;
	        	}else{
	        		nombreChat = 'campus_chat_user'+receptor+'_user'+transmisor;
	        	}

	          	//Crear el chat
	          	var chatObj ={
					id_transmisor : transmisor,
					id_receptor : receptor,
					id_curso : grupo,
					nombre_chat : nombreChat,
					fecha_actualizacion : fechaActualizacion				
				}

				//Creamos el chat
				Chats.create(chatObj).exec(function(err, chat){			
					if (err) {
	            		return res.serverError(err);
					}
		            
					//Publica que se creo un nuevo chat a todos, menos a quien lo creo
					Chats.publishCreate(chat, req);
	          		return res.json(chat);						
				})
	          }
	        });

		}else if (grupo) {
			Chats.findOne({ id_curso:grupo } ).exec(function (err, chat){
	          if (err) {
	            return res.serverError(err);
	          }
	          if (!chat) {

	        	nombreChat = 'campus_chat_group'+grupo;

	          	//Crear el chat
	          	var chatObj ={
					id_transmisor : transmisor,
					id_receptor : receptor,
					id_curso : grupo,
					nombre_chat : nombreChat,
					fecha_actualizacion : fechaActualizacion				
				}

				//Creamos el chat
				Chats.create(chatObj).exec(function(err, chat){			
					if (err) {
	            		return res.serverError(err);
					}
		            
					//Publica que se creo un nuevo chat a todos, menos a quien lo creo
					Chats.publishCreate(chat, req);
	          		return res.json(chat);						
				})
	          }
	        });
		}
      },

      listchats: function(req, res, next){

      	var socketId = sails.sockets.getId(req);
      	// Pruebas para recibir parametros
		var transmisor = req.param('id_transmisor');
	    //console.log(transmisor);

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

	    Cursos.query(queryCursos, [transmisor] ,function(err, cursosResult) {
          //Cursos
          if (err) { return res.serverError(err); }

          //Obtengo los chats de los cursos actuales del estudiante	
          var cursosEstudiante=[];
          for(cursoActual of cursosResult){
          	cursosEstudiante = cursosEstudiante.concat([{ id_curso: cursoActual.idCurso}]);

          }  
          var queryOr = [{ id_transmisor:transmisor}, { id_receptor:transmisor}].concat(cursosEstudiante);
          //Chats del usuario actual
          var findOr = { or: queryOr ,sort: 'fecha_actualizacion DESC'}; 
          //console.log(findOr);

          //Recopilo los chat individuales del usuario
            Chats.find(findOr).populate('id_receptor').populate('id_transmisor').populate('id_curso').populate('messages').exec(function (err, chats){
              if (err) {
                return res.serverError(err);
              }
              if (!chats) {
                return res.notFound('No existen registros de chats.');
              }

              //Unir los sockets a sus respectivos chats
              for(chatActual of chats){
              	//console.log(chatActual);
              	//Suscripción al socket
	            sails.sockets.join(socketId, chatActual.nombre_chat,function(err){
	                if (err) {
	                    return res.serverError(err);
	                }
	                //console.log('Inscrito en la room'+chatActual.nombre_chat);
	            });
              }

              res.json({
			              chatsUsuario : chats
			            });

	      });

	    });
      	
	 }      
	
};

