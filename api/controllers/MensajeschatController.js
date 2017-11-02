/**
 * MensajeschatController
 *
 * @description :: Server-side logic for managing mensajeschats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

	create:function(req,res){

        //GRAN PROBLEMA, LIMPIAR LAS VARIABLES RECEPTOR Y GRUPO, DESPUES DE SELECCIONADO

        var mensaje = req.param('contenido');
        var transmisor = req.param('id_transmisor');
        var receptor = req.param('id_receptor');
        var grupo = req.param('id_grupo');
        var chat = req.param('id_chat');
        var archivoAdjunto = req.param('file');

        //var adjunto = req.file('adjunto');
        //var socketId = sails.sockets.getId(req);
        //console.log(socketId);
        console.log(mensaje);
        console.log(transmisor);
        console.log(receptor);
        console.log(grupo);
        console.log(chat);
        console.log(archivoAdjunto);
        
        //Crear el mensaje
        if (receptor) { 

            Mensajeschat.create({contenido: mensaje,id_transmisor: transmisor,id_receptor:receptor, id_chat: chat}).exec(function(err, records){
                if (err) { return res.serverError(err);}
                //Recuperar el nuevo mensaje, con todos sus datos (transmisor, receptor, contenido)
                Mensajeschat.findOne(records.id_mensaje).populate('id_transmisor').populate('id_receptor').populate('id_chat').exec(function(err, message){
                    if (err) {return res.serverError(err)};
                    if (!message) {
                        return res.notFound('No se encontró el registro');
                    }

                    var fechaActualizacion = new Date();
                    Chats.update( {id_chat: records.id_chat },{fecha_actualizacion:fechaActualizacion}).exec(function(err, chat){
                        if (err) {return res.serverError(err)};
                        if (!chat) {
                            return res.notFound('No se encontró el registro');
                        }
                        
                        //Notifico el nuevo mensaje al usuario receptor
                        sails.sockets.broadcast(message.id_chat.nombre_chat, 'new_message', message);                    
                        res.json(message);

                    });     

                });      
            });

        }else if (grupo) {
            Mensajeschat.create({contenido: mensaje,id_transmisor: transmisor,id_curso:grupo, id_chat: chat}).exec(function(err, records){
                if (err) { return res.serverError(err);}
                //Recuperar el nuevo mensaje, con todos sus datos (transmisor, receptor, contenido)
                Mensajeschat.findOne(records.id_mensaje).populate('id_transmisor').populate('id_curso').populate('id_chat').exec(function(err, message){
                    if (err) {return res.serverError(err)};
                    if (!message) {
                        return res.notFound('No se encontró el registro');
                    }

                    var fechaActualizacion = new Date();
                    Chats.update( {id_chat: records.id_chat },{fecha_actualizacion:fechaActualizacion}).exec(function(err, chat){
                        if (err) {return res.serverError(err)};
                        if (!chat) {
                            return res.notFound('No se encontró el registro');
                        }
                        
                        //Notifico el nuevo mensaje al usuario receptor
                        sails.sockets.broadcast(message.id_chat.nombre_chat, 'new_message', message);                    
                        res.json(message);

                    });     

                });      
            });
        }
    },

    mensajes:function(req,res){        
        var idChat = req.param('id_chat');

        if (idChat) {
        	//Recopilo los chat individuales del usuario
            Mensajeschat.find({id_chat: idChat , sort: 'fecha_envio ASC'}).populate('id_receptor').populate('id_transmisor').populate('id_curso').exec(function (err, mensajes){
	        	if (err) {
	              return res.serverError(err);
	            }
	            if (!mensajes) {
	              return res.notFound('No existen registros de mensajes.');
	            }
	            //Retorna todos los mensajes correspondientes al chat seleccionado
	            res.json({
				    mensajesChat : mensajes
				});

		      });       	
        }//if

    }, 

    uploadFile: function(req,res){
        //La carga de archivos funciona utilizando POSMAN, analizar la forma de carga file en javascript
        var imagen = req.param('imagen');
        var archivo = req.param('archivo');

        if (imagen) {
            req.file('file').upload({
              dirname: require('path').resolve(sails.config.appPath, 'assets/imagesCC')
            },function (err, uploadedFiles) {
              if (err) return res.negotiate(err);
              res.json({
                files: uploadedFiles
              });
            });
        }else if (archivo) {
            req.file('file').upload({
              dirname: require('path').resolve(sails.config.appPath, 'assets/documentsCC')
            },function (err, uploadedFiles) {
              if (err) return res.negotiate(err);
              res.json({
                files: uploadedFiles
              });
            });
        }
        
    }
	
};

