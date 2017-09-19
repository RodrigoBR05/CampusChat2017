/**
 * Administrativo.js
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

	  	id_administrativo:{
	  		type: 'integer',
	  		autoIncrement:true,
	  		primaryKey: true
	  	}
  }
};

