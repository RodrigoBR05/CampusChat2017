/**
 * Cursos.js
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
  	id_Curso: {
  	  type: 'integer',
      autoIncrement: true,
      primaryKey: true
  	},

  	activo: {
  		type: 'integer',
      size: 8	
  	},

  	codigo: {
  		type: 'text'
  	},

  	id_Colegio: {
  		type: 'integer'
  	},
    //El curso tiene muchos mensajes
    /*
    mensajes:{
      collection:'mensajes',
      via: 'id_curso'
    },
    */

    //El curso tiene muchos mensajes
    //Chats
    chat:{
      collection: 'chats',
      via: 'id_curso'
    }

  }
};

