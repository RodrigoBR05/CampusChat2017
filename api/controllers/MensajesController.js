/**
 * MensajesController
 *
 * @description :: Server-side logic for managing mensajes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create:function(req,res){


        var mensaje = req.param('contenido');
        var transmisor = req.param('id_transmisor');
        var receptor = req.param('id_receptor');
        var grupo = req.param('id_curso');
        var room;
        //var adjunto = req.file('adjunto');
        var socketId = sails.sockets.getId(req);
        console.log(socketId);

        /*
        //La carga de archivos funciona utilizando POSMAN, analizar la forma de carga file en javascript
        req.file('adjunto').upload({
          dirname: require('path').resolve(sails.config.appPath, 'assets/images')
        },function (err, uploadedFiles) {
          if (err) return res.negotiate(err);
          //return res.json({
            //message: uploadedFiles.length + ' file(s) uploaded successfully!'
          //});
        });
        */



        //Crear el mensaje
        /*
        if (receptor) {        	
        	if(transmisor < receptor){
        		room = 'campus_chat_user'+transmisor+'_user'+receptor;
        	}else{
        		room = 'campus_chat_user'+receptor+'_user'+transmisor;
        	}
            Mensajes.create({contenido: mensaje,id_transmisor: transmisor,id_receptor:receptor, nombre_chat: room}).exec(function(err, records){
                if (err) { return res.serverError(err);}
                //Recuperar el nuevo mensaje, con todos sus datos (transmisor, receptor, contenido)
                Mensajes.findOne(records.id_mensaje).populate('id_transmisor').populate('id_receptor').exec(function(err, message){
                    if (err) {return res.serverError(err)};
                    if (!message) {
                        return res.notFound('No se encontró el registro');
                    }
                    sails.sockets.broadcast(room, 'new_message', message);                    
                    res.json(message);
                });      
            });

        }else if (grupo) {
            Mensajes.create({contenido: mensaje,id_transmisor: transmisor,id_curso:grupo, nombre_chat: grupo}).exec(function(err, records){
                if (err) { return res.serverError(err);}
                //Recuperar el nuevo mensaje, con todos sus datos (transmisor, contenido)
                Mensajes.findOne(records.id_mensaje).populate('id_transmisor').exec(function(err, message){
                    if (err) {return res.serverError(err)};
                    if (!message) {
                        return res.notFound('No se encontró el registro');
                    }
                    sails.sockets.broadcast(roomName, 'new_message', message);                    
                    res.json(message);
                });                
            });
        }
        */
    },

    mensajes:function(req,res){        
        var transmisor = req.param('transmitter');
        var receptor = req.param('receiver');
        var grupo = req.param('group');
        var room;
        

               
        
        //Buscar la forma de integrar el grupo
        if (receptor) {
            if(transmisor < receptor){
                room = 'campus_chat_user'+transmisor+'_user'+receptor;
            }else{
                room = 'campus_chat_user'+receptor+'_user'+transmisor;
            }
            //Suscripción al socket
            /*
            sails.sockets.join(req.socket, room,function(err){
                if (err) {
                    return res.serverError(err);
                }
                //console.log('Inscrito en la room'+roomName);
            });
            */
            //Recopilo los mensajes del usuario desde la relación User-Message
            Mensajes.find({
                //Mensajes recibidos o enviados de o hacia el usuario actual
                or: [
                    { id_transmisor:transmisor, id_receptor:receptor},
                    { id_transmisor:receptor, id_receptor:transmisor}
                ]
            ,sort: 'id_mensaje ASC'}).populate('id_receptor').populate('id_transmisor').exec(function (err, messages){
              if (err) {
                return res.serverError(err);
              }
              if (!messages) {
                return res.notFound('No existen registros de mensajes.');
              }

              //sails.log('Registro encontrado:', message);
              return res.json(messages);
            });          
        }
        //Si no existe receptor se debe buscar en el grupo seleccionado
        else if (grupo){
            //Recopilo los mensajes de ese grupo
            Message.find({group: grupo,sort: 'id DESC'}).populate('transmitter').exec(function (err, message){
              if (err) {
                return res.serverError(err);
              }
              if (!message) {
                return res.notFound('No existen registros de mensajes.');
              }

              //sails.log('Registro encontrado:', message);
              return res.json(message);
            });  
        }

    },


    chatList:function(req,res){ 
        console.log('Estoy en la lista de chats');
        //return res.json('Existe, Campus Chat');
    }
	
};