/**
 * Si_user.js
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

  	id: {
  	  type: 'integer',
      autoIncrement: true,
      primaryKey: true
  	},

  	name: {
  		type: 'string',
  		size: 40
  	},

  	last_name: {
  		type: 'string',
  		size: 45
  	},

  	last_name2: {
  		type: 'string',
  		size: 100
  	},

  	email: {
  		type: 'string',
  		size: 255
  	},

  	password: {
  		type: 'string',
  		size: 255
  	},

  	enabled: {
  		type: 'integer'		
  	},

  	rol: {
  		type: 'integer'		
  	},

  	imagen: {
  		type: 'text'
  	},

  	institucionDefault: {
  		type: 'integer'
  	},

  	usuarioReceptor: {
  		collection: 'relacionesfamiliares',
  		via: 'id_UsuarioReceptor'
  	},

  	encargado: {
  		collection: 'relacionesfamiliares',
  		via: 'id_Encargado'
  	},
    //El usuario envía muchos mensajes
    sentMessages:{
      collection:'mensajes',
      via: 'id_transmisor'
    },
    //El usuario recibe muchos mensaje
    receivedMessages:{
      collection: 'mensajes',
      via: 'id_receptor'
    }

  }
};

