/**
 * Cursosestudiantes.js
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

  	id_CursoEstudiante: {
  	  type: 'integer',
  	  required: true,
      autoIncrement: true,
      primaryKey: true
  	},

  	id_Usuario: {
  		type: 'integer'		
  	},

  	id_Curso: {
  		type: 'integer'		
  	},

  	id_CursoEntidad: {
  		type: 'integer'		
  	},

  	id_Estado: {
  		type: 'integer'		
  	}

  }
};

