/**
 * Adjuntochat.js
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

  	id_adjunto_chat: {
  	  type: 'integer',
      autoIncrement: true,
      primaryKey: true
  	},

  	ubicacion: {
  		type: 'text'
  	},

  	nombre_archivo: {
  		type: 'text'
  	},

  	tipo_archivo: {
  		type: 'text'
  	},

  	descripcion: {
  		type: 'text'
  	},

  	id_chat: {
      model: 'chats'   
    },

  	id_transmisor: {
  		model: 'si_user'
  	},    

    fecha_envio:{
      type: 'datetime',
      defaultsTo: function() {
        return new Date();
      }


    }

  }
};

