/**
 * Mensajes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  
  //Eliminar configuraciones por defecto
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  schema: true,

  attributes: {

  	id_mensaje: {
  	  type: 'integer',
      autoIncrement: true,
      primaryKey: true
  	},

  	contenido: {
  		type: 'text'
  	},

  	id_transmisor: {
  		model: 'si_user'
  	},

  	id_receptor: {
  		model: 'si_user'
  	},

  	id_curso: {
  		model: 'cursos'		
  	},

  	nombre_chat: {
  		type: 'text'
  	}, 

    fecha_envio:{
      type: 'datetime',
      defaultsTo: function() {
        return new Date();
      }


    }

  }
};

