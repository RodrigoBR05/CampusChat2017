/**
 * Cursoentidad.js
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

  	id_CursoEntidad: {
  	  type: 'integer',
  	  required: true,
      autoIncrement: true,
      primaryKey: true
  	},

  	id_Curso: {
  		type: 'integer'		
  	},

  	estado: {
  		type: 'integer',
      size: 8	
  	},

    codigo: {
      type: 'text'
    },

  	id_profesor: {
  		type: 'integer'		
  	},

  	id_CursoEntidadPadre: {
  		type: 'integer'		
  	},

  	imagen: {
  		type: 'text'
  	},

  	id_Colegio: {
  		type: 'integer'
  	},
    //Chats
    chat:{
      collection: 'chats',
      via: 'id_curso'
    }

  }
};

