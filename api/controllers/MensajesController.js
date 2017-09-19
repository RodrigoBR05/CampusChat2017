/**
 * MensajesController
 *
 * @description :: Server-side logic for managing mensajes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create:function(req,res){
        var mensaje = req.param('mensaje');
        var transmisor = req.param('transmisor');
        var receptor = req.param('receptor');
        var grupo = req.param('grupo');

        //Crear el mensaje
        if (receptor) {        	
        	var room;
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
                    res.json(message);
                    //sails.sockets.broadcast(roomName, 'new_message', message);
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
                    res.json(message);
                    //sails.sockets.broadcast(roomName, 'new_message', message);
                });                
            });
        }
    }
	
};