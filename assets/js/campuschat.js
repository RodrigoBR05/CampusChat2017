/*Líbrería con las funciones de Campus Chat*/
/*Autor: Rodrigo Brenes Ramírez, 2017*/
/*Versión 0.1*/

var receptor = null;
var grupo = null;

var cursos;
var usuariosReceptores;
var chatsUsuario;
var chatSeleccionadoActual;
//Petición para mensajes
var peticion = '/mensajes/mensajes';          
//Botones
var enviarMensajeButton = document.querySelector('#enviarMensajeButton'); 
var enviarMensajeConArchivoButton = document.querySelector('#enviarMensajeConArchivoButton');    
var adjuntarImagen = document.querySelector('#imagenAdjuntaBtn');
var adjuntarArchivo = document.querySelector('#archivoAdjuntoBtn');
var imagenAdjuntaInput = document.querySelector('#imagenAdjunta');
var archivoAdjuntoInput = document.querySelector('#archivoAdjunto'); 
var cerrarModalArchivosSel = document.querySelector('#cerrarModalArchivosSeleccionados');    

//Cuerpo del mensaje
var mensaje = document.querySelector('#mensaje');
var mensajeAdjunto = document.querySelector('#mensajeAdjunto');

var listaMensajes = document.querySelector('#chatList');
//Contactos
var contactosList = document.querySelector('#contactosList');      

//Carga de archivos
imagenAdjuntaInput.addEventListener('change', mostrarArchivo, false);
archivoAdjuntoInput.addEventListener('change', mostrarArchivo, false);

/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Da funcionalidad a los botones de adjuntar archivos
*/
adjuntarImagen.addEventListener('click', function(e){
	$("#imagenAdjunta").click();
});

adjuntarArchivo.addEventListener('click', function(e){
	$("#archivoAdjunto").click();
});     


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Cierra el modal de previsualización de archivos y reinicia valores de los inputs
*/
cerrarModalArchivosSel.addEventListener('click', function(e){
	$('#mensaje').focus(); //Mantengo focalizado el input de mensajes
	mensajeAdjunto.value = null;
	reiniciarInputsArchivos();
}); 

/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Reinicia los valores los inputs para permitir una previsualización correcta
*/
function reiniciarInputsArchivos(){
	var $fileImagenAdj = $('#imagenAdjunta');
	$fileImagenAdj.wrap('<form>').closest('form').get(0).reset();
	$fileImagenAdj.unwrap();
	var $filearchivoAdj = $('#archivoAdjunto');
	$filearchivoAdj.wrap('<form>').closest('form').get(0).reset();
	$filearchivoAdj.unwrap();
}


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Permite previsualizar el archivo antes de enviarlo
*/
function mostrarArchivo(evt) {

	var files = evt.target.files; // FileList object

	if (files[0].type.match('image.*')) {
	  $("#tituloArchivoSeleccionado").html(files[0].name); 
	  $('#tituloArchivoSeleccionado').hide(); //oculto el título               

	  var reader = new FileReader();             
	  reader.onload = (function(theFile) {
	     return function(e) {
	     // Creamos la imagen.
	     document.getElementById("imagenArchivoSeleccionado").src = e.target.result;

	     };
	  })(files[0]);

	  reader.readAsDataURL(files[0]);                  
	}else{
	  $("#tituloArchivoSeleccionado").html(files[0].name);
	  $('#tituloArchivoSeleccionado').show();             
	  document.getElementById("imagenArchivoSeleccionado").src = '/images/file.png';
	}

	$('#mensaje').blur(); //Quito el focalizado el input de mensajes
	$('#enviarArchivosModal').modal('open');                                   
	$('#mensajeAdjunto').focus(); //Quito el focalizado el input de mensajes

}//mostrarArchivo


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Agrega los adjuntos del chat seleccionado a la lista de adjuntos en el modal
*/
function addAdjuntos(data){
	$('#multimedia').empty();
	$('#documentos').empty();        

	for(let adjuntoActual of data){
	  let extension = adjuntoActual.nombre_archivo;

	  if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {
	    $("#multimedia").append('<div class="col s6 m4 l2 xl2">'+
	                            '<div class="card">'+
	                              '<div class="card-image">'+
	                                '<img src="'+adjuntoActual.ubicacion+'"alt="">'+
	                                '<a href="'+adjuntoActual.ubicacion+'" class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                              '</div>'+
	                              '<div class="card-content">'+
	                                '<span class="card-title truncate">'+adjuntoActual.nombre_archivo+'</span>'+
	                                '<p class="truncate">'+adjuntoActual.descripcion+'</p>'+
	                              '</div>'+
	                            '</div>'+
	                          '</div>'); 
	  }else{
	    if (extension.match(/\.(pdf)|(PDF)$/) ) {
	      $("#documentos").append('<div class="col s6 m4 l2 xl2">'+
	                                '<div class="card">'+
	                                  '<div class="card-image">'+
	                                    '<img src="/images/pdf_cc.png" alt="">'+
	                                    '<a href="'+adjuntoActual.ubicacion+'"class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                                  '</div>'+
	                                  '<div class="card-content">'+
	                                    '<span class="card-title truncate">'+adjuntoActual.nombre_archivo+'</span>'+
	                                    '<p class="truncate">'+adjuntoActual.descripcion+'</p>'+
	                                  '</div>'+
	                                '</div>'+
	                              '</div>');
	    }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	      $("#documentos").append('<div class="col s6 m4 l2 xl2">'+
	                                '<div class="card">'+
	                                  '<div class="card-image">'+
	                                    '<img src="/images/doc_cc.png" alt="">'+
	                                    '<a href="'+adjuntoActual.ubicacion+'"class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                                  '</div>'+
	                                  '<div class="card-content">'+
	                                    '<span class="card-title truncate">'+adjuntoActual.nombre_archivo+'</span>'+
	                                    '<p class="truncate">'+adjuntoActual.descripcion+'</p>'+
	                                  '</div>'+
	                                '</div>'+
	                              '</div>');
	    }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	      $("#documentos").append('<div class="col s6 m4 l2 xl2">'+
	                                '<div class="card">'+
	                                  '<div class="card-image">'+
	                                    '<img src="/images/xls_cc.png" alt="">'+
	                                    '<a href="'+adjuntoActual.ubicacion+'" class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                                  '</div>'+
	                                  '<div class="card-content">'+
	                                    '<span class="card-title truncate">'+adjuntoActual.nombre_archivo+'</span>'+
	                                    '<p class="truncate">'+adjuntoActual.descripcion+'</p>'+
	                                  '</div>'+
	                                '</div>'+
	                              '</div>');              
	    }//if-else
	    
	  }//else externo

	}//for

}//addAdjuntos


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Agrega el nuevo adjunto a la lista de adjuntos en el modal
*/
function addAdjunto(data){

	let extension = data.nombre_archivo;

	if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {
	  $("#multimedia").prepend('<div class="col s6 m4 l2 xl2">'+
	                          '<div class="card">'+
	                            '<div class="card-image">'+
	                              '<img src="/images/img_cc.png" alt="">'+
	                              '<a href="'+data.ubicacion+'" class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                            '</div>'+
	                            '<div class="card-content">'+
	                              '<span class="card-title truncate">'+data.nombre_archivo+'</span>'+
	                              '<p class="truncate">'+data.descripcion+'</p>'+
	                            '</div>'+
	                          '</div>'+
	                        '</div>'); 
	}else{
	  if (extension.match(/\.(pdf)|(PDF)$/) ) {
	    $("#documentos").prepend('<div class="col s6 m4 l2 xl2">'+
	                              '<div class="card">'+
	                                '<div class="card-image">'+
	                                  '<img src="/images/pdf_cc.png" alt="">'+
	                                  '<a href="'+data.ubicacion+'"class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                                '</div>'+
	                                '<div class="card-content">'+
	                                  '<span class="card-title truncate">'+data.nombre_archivo+'</span>'+
	                                  '<p class="truncate">'+data.descripcion+'</p>'+
	                                '</div>'+
	                              '</div>'+
	                            '</div>');
	  }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	    $("#documentos").prepend('<div class="col s6 m4 l2 xl2">'+
	                              '<div class="card">'+
	                                '<div class="card-image">'+
	                                  '<img src="/images/doc_cc.png" alt="">'+
	                                  '<a href="'+data.ubicacion+'"class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                                '</div>'+
	                                '<div class="card-content">'+
	                                  '<span class="card-title truncate">'+data.nombre_archivo+'</span>'+
	                                  '<p class="truncate">'+data.descripcion+'</p>'+
	                                '</div>'+
	                              '</div>'+
	                            '</div>');
	  }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	    $("#documentos").prepend('<div class="col s6 m4 l2 xl2">'+
	                              '<div class="card">'+
	                                '<div class="card-image">'+
	                                  '<img src="/images/xls_cc.png" alt="">'+
	                                  '<a href="'+data.ubicacion+'" class="btn-floating halfway-fab colorCampusChat" title="Descargar" download><i class="material-icons">file_download</i></a>'+
	                                '</div>'+
	                                '<div class="card-content">'+
	                                  '<span class="card-title truncate">'+data.nombre_archivo+'</span>'+
	                                  '<p class="truncate">'+data.descripcion+'</p>'+
	                                '</div>'+
	                              '</div>'+
	                            '</div>');              
	  }//if-else
	  
	}//else externo

}//addAdjunto


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Envía los datos del nuevo mensaje con archivos para guadarlo en la BD
*/
enviarMensajeConArchivoButton.addEventListener('click', function(e){

	e.preventDefault();
	var formData = new FormData(document.getElementById("mensajesConArchivosForm"));

	//Verificar que el input file de imagen o documento exista
	var imagenAdjunta = document.getElementById('imagenAdjunta').files.length;  
	var archivoAdjunto = document.getElementById('archivoAdjunto').files.length;  

	if( (imagenAdjunta == 1) && (archivoAdjunto == 0) ){
	  //console.log('Voy a enviar imagen');
	  formData.append("imagen", "1");
	  formData.append("file", document.getElementById("imagenAdjunta").files[0]);
	}else if ((imagenAdjunta == 0) && (archivoAdjunto == 1) ) {
	  formData.append("archivo", "1");
	  formData.append("file", document.getElementById("archivoAdjunto").files[0]);
	}

	$.ajax({
	    url: "/mensajeschat/uploadFile",
	    type: "post",
	    data: formData,
	    cache: false,
	    contentType: false,
	    processData: false,
	    success: function(fileRes){
	      if (fileRes) {

	        reiniciarInputsArchivos();

	        var data = {
	          contenido: mensajeAdjunto.value,
	          id_transmisor: transmisorId,
	          id_receptor: receptor,
	          id_grupo: grupo,
	          id_chat: chatSeleccionadoActual,
	          file: fileRes
	        }

	          //Guardar los mensajes en la BD, persistencia
	        io.socket.post('/mensajeschat', data, function(data, response) {
	          mensajeAdjunto.value = null;
	        });

	        //Se cierra el modal de los visualizar archivos
	        $('#mensajeAdjunto').blur(); //Mantengo focalizado el input de mensajes
	        $('#enviarArchivosModal').modal('close'); 
	        $('#mensaje').focus(); //Mantengo focalizado el input de mensajes

	      }             

	    },            
	    error: function (){ // Si hay algún error.
	      alert("El archivo no pudo ser cargado correctamente.");
	    }
	});

});


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Envía los datos del nuevo mensaje para guadarlo en la BD
*/
enviarMensajeButton.addEventListener('click', function(e){
	if (mensaje.value) {
	  var data = {
	    contenido: mensaje.value,
	    id_transmisor: transmisorId,
	    id_receptor: receptor,
	    id_grupo: grupo,
	    id_chat: chatSeleccionadoActual
	  }

	  //Guardar los mensajes en la BD
	  io.socket.post('/mensajeschat', data, function(data, response) {
	    mensaje.value = null;
	  });
	}//if
}); 


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Si se crea un nuevo chat se agrega a la lista de chats
*/
function newChat(data) {

	var  curso = data.idCurso;
	var companiero = data.idCompaniero;

	if (curso) {
	   document.getElementById("imagenUsuarioSeleccionado").src = "/images/curso.png";
	   $("#nombreUsuarioSeleccionado").html('&nbsp&nbsp'+data.nombreClase);

	}else if (companiero) {
	  document.getElementById("imagenUsuarioSeleccionado").src = data.imagen;
	  $("#nombreUsuarioSeleccionado").html('&nbsp&nbsp'+data.nombreCompaniero+' '+data.apellido1Companiero);
	}

	$('#chatList').empty();  
	$('#logoInicio').hide(); //oculto el logo                
	$('#nav').show(); //muestro el encabezado con la información del usuario seleccionado
	$('#cargaArchivos').show(); 
	$('#infoUsuarioSeleccionado').show();                               
	$('#footer').show(); //muestro el encabezado con la información del usuario seleccionadofdgdf
	//Muestra el último mensaje
	$("#chatBody").animate({scrollTop: $(this).height()+100000}, 'fast');
	$('#chatBody').show(); //muestro la listas de mensajes        
	return false;

}//newChat


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Verifica si el chat con el curso seleccionado existe,
* Sí existe: Muestra los mensajes
* Sí no existe: actualiza la lista de los chats
*/
function cursoSeleccionado(curso) { 
	//Grupo receptor
	grupo = curso.idCurso; 
	//Se cierra el modal de los contactos del usuario
	$('#contactos').modal('close');  
	//Verificar que el chat exista o no en la lista chatsUsuario
	var chatSeleccionado; 
	var existeChat=false;

	//console.log(grupo);
	//console.log(chatsUsuario);

	for(let chatAct of chatsUsuario){
	  if (chatAct.id_curso) {
	    if ( chatAct.id_curso.id_CursoEntidad == grupo ) {
	      chatSeleccionado = chatAct;
	      existeChat = true;
	    }
	  }        
	}//for

	if (existeChat) {
	  //muestro el chat desde la lista chatsUsuario
	  mostrarMensajes({ idChat : chatSeleccionado.id_chat });
	}else{
	  //Creo un nuevo registro en la tabla chats
	  var chat = { id_curso : grupo };
	  io.socket.post('/chats/create/', chat, function(data, response) {
	    if (data) {
	      for(let cursoActual of cursos){
	        if ( cursoActual.idCurso == data.id_curso ) {
	          chatSeleccionadoActual = data.id_chat;
	          newChat(cursoActual);
	          break;
	        }
	      }

	      actualizarListaChats();
	    }//if
	  });
	}//else           
}//cursoSeleccionado

/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Verifica si el chat con el usuario seleccionado existe,
* Sí existe: Muestra los mensajes
* Sí no existe: actualiza la lista de los chats
*/
function usuarioSeleccionado(usuario) { 
	//Usuario o grupo receptor
	receptor = usuario.idCompaniero; 
	//Se cierra el modal de los contactos del usuario
	$('#contactos').modal('close');  
	$('#imagenAdjuntaBtn').show(); 
	$('#cargaArchivos').show(); 
	$('#listaArchivos').show();         

	//Verificar que el chat exista o no en la lista chatsUsuario
	var chatSeleccionado; 
	var existeChat=false;

	for(let chatAct of chatsUsuario){
	  if (chatAct.id_transmisor) {
	    if ( (chatAct.id_transmisor.id == transmisorId && chatAct.id_receptor.id == receptor ) || (chatAct.id_transmisor.id == receptor && chatAct.id_receptor.id == transmisorId )) {
	      chatSeleccionado = chatAct;
	      existeChat = true;
	      break;
	    }
	  }
	}//for

	if (existeChat) {
	  //muestro el chat desde la lista chatsUsuario
	  mostrarMensajes({ idChat : chatSeleccionado.id_chat });
	}else{

	  //Creo un nuevo registro en la tabla chats
	  var chat = { id_transmisor : transmisorId, id_receptor : receptor };
	  io.socket.post('/chats/create/', chat, function(data, response) {
	    if (data) {
	      for(let usuarioAct of usuariosReceptores){
	        
	        if ( (usuarioAct.idCompaniero == data.id_receptor) ) {
	          chatSeleccionadoActual = data.id_chat;
	          newChat(usuarioAct);
	          break;
	        }
	      }//for

	      actualizarListaChats();
	    }
	  });
	}//else                  

}//usuario seleccionado  


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Muestra y notifica la recepción de un nuevo mensaje
*/
function addMensaje(data) {

	if ( chatSeleccionadoActual == data.id_chat.id_chat) {
	  //console.log(data);
	  if (data.id_curso) {
	    
	    if (transmisorId == data.id_transmisor.id) {             

	      if (data.id_adjunto_chat) {

	        let extension = data.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');              
	          }//if-else
	        }//else externo
	        addAdjunto(data.id_adjunto_chat);

	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                            '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                            '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+
	                            '</p>'+
	                          '</li>'); 
	      }

	    }else{
	      if (data.id_adjunto_chat) {

	        let extension = data.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	            $('#chatAudio')[0].play();

	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	            $('#chatAudio')[0].play();

	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	            $('#chatAudio')[0].play();

	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');   
	            $('#chatAudio')[0].play();

	          }//if-else
	        }//else externo
	        addAdjunto(data.id_adjunto_chat);


	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+                                  
	                          '</p>'+
	                        '</li>');
	        $('#chatAudio')[0].play();
	    }
	  }
	  //else chat individual
	  }else{
	    if (transmisorId == data.id_transmisor.id) {             

	      if (data.id_adjunto_chat) {


	        let extension = data.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');              
	          }//if-else
	        }//else externo
	        addAdjunto(data.id_adjunto_chat);


	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                            '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                            '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+
	                            '</p>'+
	                          '</li>'); 
	      }

	    }else{
	      if (data.id_adjunto_chat) {


	        let extension = data.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');
	          $('#chatAudio')[0].play();

	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	            $('#chatAudio')[0].play();

	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	            $('#chatAudio')[0].play();

	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+data.id_adjunto_chat.nombre_archivo.replace(/_/gi," ")+'&nbsp<a href="'+data.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+data.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');  
	            $('#chatAudio')[0].play();

	          }//if-else
	        }//else externo
	        addAdjunto(data.id_adjunto_chat);                


	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'"src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(data.fecha_envio)+'"><b>'+data.id_transmisor.name+' '+data.id_transmisor.last_name+' '+data.id_transmisor.last_name2+'</b><br>'+data.contenido+                                  
	                          '</p>'+
	                        '</li>'); 
	        $('#chatAudio')[0].play();

	      }              
	    }                                 
	  }//else externo

	  //Muestra el mensaje enviado
	  $("#chatList").animate({scrollTop: $(this).height()+100000}, 'fast');
	  return false;

	}else{
	    //IMPLEMENTAR PASAR EL CHAT DE PRIMERO CON EL NUEVO MENSAJE
	    $('#chatAudio')[0].play();
	    actualizarListaChats();
	}        
}//addMensaje


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Escucha cuando se crea un nuevo mensaje
*/
io.socket.on('new_message', function(newMessage){  
	addMensaje(newMessage);            
}); 


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Escucha cuando se crea un nuevo chat y verifica si tiene relación con el usuario
*/
io.socket.on('chats', function (event) {
	//Si se crea un nuevo chat todos los usuarios actualizan su lista de contactos
	switch (event.verb) {
	  case 'created':
	    //Actualizar la lista de los chat cuando se crea un nuevo chat para el usuario
	    //console.log(event);
	    if ( (transmisorId == event.data.id_transmisor) || (transmisorId == event.data.id_receptor) ) {
	      actualizarListaChats();
	    }

	    for(let cursoActual of cursos){
	      if ( event.data.id_curso == cursoActual.idCurso ) {
	        actualizarListaChats();
	      }
	    }
	    
	    break;
	    
	  default:
	    console.warn('Evento del socket no reconocido por el servidor:',event.verb, event);
	}
}); //io.socket.on chats


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Actualiza la lista de los chats del usuario
*/
function actualizarListaChats() {
//Actualizar la lista de chat del usuario
$('#slide-out').empty();
	addEncabezadoListaChatsUsuarios();
	var chatData = { id_transmisor : transmisorId };
	  io.socket.get('/chats/listchats',chatData,function(data, response) {
	    chatsUsuario = data.chatsUsuario;
	    for(let chatActual of data.chatsUsuario){
	      addListaChatsUsuarios(chatActual);
	    } 
	  });//io.socket.get 
}


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Datos iniciales de la aplicación, trae los contactos, cursos y chats, 
* relacionados con el usuario
*/

io.socket.get('/chats/chatsindex',function(data, response) {
	cursos = data.cursos;
	usuariosReceptores = data.companieros;
	chatsUsuario = data.chatsUsuario;
	//Obtener todo lo relacionado con el usuario, contactos, grupos, chats.
	for(cursoActual of data.cursos){
	  addCursos(cursoActual);
	}   

	for(companieroActual of data.companieros){
	  addCompanieros(companieroActual);
	}   

	addEncabezadoListaChatsUsuarios();
	for(chatActual of data.chatsUsuario){
	  addListaChatsUsuarios(chatActual);
	}     
});//io.socket.get


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Muestra el contenido de los mensajes del chat seleccionado
*/
function addMensajes(data) {

	//console.log(data);
	$('#chatList').empty(); 

	for(let mensajeActual of data){
	  if (mensajeActual.id_curso) {
	    //console.log(mensajeActual);

	    if (transmisorId == mensajeActual.id_transmisor.id) {             

	      if (mensajeActual.id_adjunto_chat) {
	        let extension = mensajeActual.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');              
	          }//if-else
	        }//else externo


	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                            '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                            '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+
	                            '</p>'+
	                          '</li>'); 
	      }

	    }else{
	      if (mensajeActual.id_adjunto_chat) {

	        let extension = mensajeActual.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');              
	          }//if-else
	        }//else externo


	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+                                  
	                          '</p>'+
	                        '</li>'); 
	      }   
	    }

	  }else{

	    if (transmisorId == mensajeActual.id_transmisor.id) { 

	      if (mensajeActual.id_adjunto_chat) {
	        let extension = mensajeActual.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating white" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons colorCampusChat-text">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');              
	          }//if-else
	        }//else externo


	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                            '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                            '<p class="mensajeTransmisor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+
	                            '</p>'+
	                          '</li>'); 
	      }

	    }else{
	      if (mensajeActual.id_adjunto_chat) {

	        let extension = mensajeActual.id_adjunto_chat.nombre_archivo;

	        if (extension.match(/\.(jpg)|(jpeg)|(png)|(JPG)|(JPEG)|(PNG)$/) ) {

	          $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/img_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	        }else{
	          if (extension.match(/\.(pdf)|(PDF)$/) ) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/pdf_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(doc)|(docx)|(odt)|(DOC)|(DOCX)|(ODT)$/)) {
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/doc_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>'); 
	          }else if (extension.match(/\.(xls)|(xlsx)|(ods)|(XLS)|(XLSX)|(ODS)$/)){
	            $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+'<br>'+
	                            '<span class="valign-wrapper"> <img class="responsive-img" src="/images/xls_cc_w.png" alt="" width="50" height="50">&nbsp'+mensajeActual.id_adjunto_chat.nombre_archivo.replace(/_|-/gi," ")+'&nbsp<a href="'+mensajeActual.id_adjunto_chat.ubicacion+'" class="btn-floating colorCampusChat" title="Descargar" download="'+mensajeActual.id_adjunto_chat.nombre_archivo+'"><i class="material-icons">file_download</i></a>'+
	                          '</p>'+
	                        '</li>');              
	          }//if-else
	        }//else externo

	      }else{
	        $("#chatList").append('<li class="collection-item valign-wrapper col s12" style="background-color: rgba(0, 0, 0, 0)">'+
	                          '<img title="'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'"src="'+mensajeActual.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                          '<p class="mensajeReceptor" title="'+formatoFechaMensajes(mensajeActual.fecha_envio)+'"><b>'+mensajeActual.id_transmisor.name+' '+mensajeActual.id_transmisor.last_name+' '+mensajeActual.id_transmisor.last_name2+'</b><br>'+mensajeActual.contenido+                                  
	                          '</p>'+
	                        '</li>'); 
	      }              
	    }

	  }//else externo        
	}//for

	$('#logoInicio').hide(); //oculto el logo                
	$('#nav').show(); //muestro el encabezado con la información del usuario seleccionado
	$('#footer').show(); //muestro el encabezado con la información del usuario seleccionado
	$('#cargaArchivos').show(); 

	//Muestra el último mensaje
	$("#chatList").animate({scrollTop: $(this).height()+100000}, 'fast');
	$('#chatList').show(); //muestro la listas de mensajes        
	return false;

}//addMensajes

/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Muestra el encabezado del chat seleccionado
* @nota: la imagen del curso esta por defecto
*/
function addEncabezadoChat(data){

	var grupo = data.id_curso;
	var usuarioTransmisorChat = data.id_transmisor;
	var usuarioReceptorChat =  data.id_receptor;

	if (grupo) {
	  document.getElementById("imagenUsuarioSeleccionado").src = "/images/curso.png";
	  $("#nombreUsuarioSeleccionado").html('&nbsp&nbsp'+grupo.codigo);
	}else if (transmisorId == usuarioTransmisorChat.id) {
	  document.getElementById("imagenUsuarioSeleccionado").src = usuarioReceptorChat.imagen;
	  $("#nombreUsuarioSeleccionado").html('&nbsp&nbsp'+usuarioReceptorChat.name+' '+usuarioReceptorChat.last_name);
	}else{
	  document.getElementById("imagenUsuarioSeleccionado").src = usuarioTransmisorChat.imagen;
	  $("#nombreUsuarioSeleccionado").html('&nbsp&nbsp'+usuarioTransmisorChat.name+' '+usuarioTransmisorChat.last_name);
	}
	$('#infoUsuarioSeleccionado').show();         

}//addEncabezadoChat


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Muestra los mensajes del chat seleccionado
*/
function mostrarMensajes(data) { 
	receptor = null;
	grupo = null;
	$('#imagenAdjuntaBtn').show(); 
	$('#archivoAdjuntoBtn').show(); 
	$('#listaArchivos').show(); 
	$('#chatList').empty();
	//Muestra los mensajes del chat seleccionado
	var idChatSeleccionado = data.idChat;

	for(let chatActual of chatsUsuario){
	  if (chatActual.id_chat == idChatSeleccionado) {

	    if(chatActual.id_curso){
	      grupo = chatActual.id_curso.id_CursoEntidad;
	    }else if (transmisorId == chatActual.id_transmisor.id) {
	      receptor = chatActual.id_receptor.id;
	    }else{
	      receptor = chatActual.id_transmisor.id;
	    }
	    addEncabezadoChat(chatActual);
	    //Obtener los mensajes del chat seleccionado
	    io.socket.get('/mensajeschat/mensajes',{ id_chat:idChatSeleccionado },function(data, response) {
	      if (data) {
	        chatSeleccionadoActual = chatActual.id_chat;
	        //console.log(data.mensajesChat);
	        addMensajes(data.mensajesChat);
	        addAdjuntos(data.adjuntosChat);
	      } 
	    });//io.socket.get
	  }
	}
}//mostrarMensajes


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Agrega el encabezado de la lista de chats nombre de usuario e imagen
*/
function addEncabezadoListaChatsUsuarios(){
	//Agrega el encabezado de la lista de chats                 
	$('#slide-out').empty();        
	$("#slide-out").append('<li>'+
	                          '<nav class="top-nav colorCampusChat">'+
	                            '<div class="row">'+
	                              '<div class="valign-wrapper col s8 m8 l8 xl8 offset-s1 offset-m1 offset-l1 offset-xl1">'+
	                                  '<img title=" " src="'+transmisorImagen+'" alt="" class="circle responsive-img" width="50" height="50"> '+
	                                  '<span id="nombreUsuarioSeleccionado" class="white-text"><b>&nbsp;'+transmisorNombre+' '+transmisorApellido+'</b></span>'+
	                              '</div>'+
	                             '</div>'+                       
	                          '</nav>'+
	                        '</li>'+
	                        '<li>'+
	                            '<a href="#contactos" title="Nuevo chat" class="btn colorCampusChat modal-trigger" type="submit" name="action"><i class="material-icons right white-text">person</i>Contactos'+
	                            '</a>'+
	                        '</li>'
	                        );                               
}//addEncabezadoListaChatsUsuarios


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Agrega la lista de chats del usuario 
*/
function addListaChatsUsuarios(data) { 
	//Agregar los chats a la lista de chats
	if (data.id_curso) {
	  //NOTA: LA IMAGEN DE LOS CURSOS SE ENCUENTRA DE FORMA ESTÁTICA, BUSCAR LA FORMA DE HACERLA DINÁMICA
	  $("#slide-out").append('<li>'+
	                            '<a href="#" onclick="mostrarMensajes({idChat:'+data.id_chat+'});return false;">'+
	                              '<div class="valign-wrapper">'+
	                                 '<img src="/images/curso.png" alt="" class="circle responsive-img" width="50" height="50">'+
	                                  '<span class="black-text">'+
	                                    data.id_curso.codigo+
	                                  '</span>'+
	                              '</div>'+
	                            '</a>'+
	                            '<div class="divider"></div>'+
	                            '<div class="divider"></div>'+
	                          '</li>');

	}else if (transmisorId == data.id_transmisor.id) {
	  $("#slide-out").append('<li>'+
	                            '<a href="#" onclick="mostrarMensajes({idChat:'+data.id_chat+'});return false;">'+
	                              '<div class="valign-wrapper">'+
	                                  '<img src="'+data.id_receptor.imagen+'" alt="" class="circle responsive-img" width="50" height="50"> '+
	                                  '<span class="black-text">'+
	                                    data.id_receptor.name+" "+data.id_receptor.last_name+
	                                  '</span>'+
	                              '</div>'+
	                            '</a>'+
	                            '<div class="divider"></div>'+
	                            '<div class="divider"></div>'+
	                          '</li>');
	}else{
	  $("#slide-out").append('<li>'+
	                            '<a href="#" onclick="mostrarMensajes({idChat:'+data.id_chat+'});return false;">'+
	                              '<div class="valign-wrapper">'+
	                                  '<img src="'+data.id_transmisor.imagen+'" alt="" class="circle responsive-img" width="50" height="50"> '+
	                                  '<span class="black-text">'+
	                                    data.id_transmisor.name+" "+data.id_transmisor.last_name+
	                                  '</span>'+
	                              '</div>'+
	                            '</a>'+
	                            '<div class="divider"></div>'+
	                            '<div class="divider"></div>'+
	                          '</li>');
	} 
}//addListaChatsUsuarios

/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Agrega a la lista de contactos los compañeros relacionados con el usuario 
*/
function addCompanieros(data) { 
	//Agregar los usuarios relacionados a la lista de contactos
	$("#contactosList").append('<li class="collection-item avatar">'+
	                                  '<a href="#" onclick="usuarioSeleccionado({ idCompaniero:'+data.idCompaniero+' });return false;'+'">'+
	                                    '<img src="'+data.imagen+'" alt="" class="circle responsive-img" width="50" height="50">'+
	                                    '<span class="title black-text">Estudiante</span>'+
	                                    '<p class="black-text">'+data.nombreCompaniero+" "+data.apellido1Companiero+'</p>'+
	                                    '<a  class="secondary-content"><i class="material-icons colorCampusChat-text">message</i></a>'+
	                                  '</a>'+
	                                '</li>'); 
}//addCompanieros


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Agrega a la lista de contactos los cursos relacionados con el usuario 
*/
function addCursos(data) { 
	//Agregar los cursos a la lista de contactos
	$("#contactosList").append('<li class="collection-item avatar">'+
	                                  '<a href="#" onclick="cursoSeleccionado({ idCurso:'+data.idCurso+' });return false;'+'">'+
	                                    '<img src="/images/curso.png" alt="" class="circle responsive-img" width="50" height="50">'+
	                                    '<span class="title black-text">Curso</span>'+
	                                    '<p class="black-text">'+data.nombreClase+'</p>'+
	                                    '<a  class="secondary-content"><i class="material-icons colorCampusChat-text">message</i></a>'+
	                                  '</a>'+
	                                '</li>');

}//addCursos


/*
* @author: Rodrigo
* @modificado por:
*/
/**
* @descripción: Da formato a la fecha de los mensajes, retornando el día, mes, año y hora  
*/
function formatoFechaMensajes(fecha){
	//Formato de las fechas
	var anio = fecha.substring(0,4);
	var mes = fecha.substring(5,7);
	var dia = fecha.substring(8,10);
	var hora = fecha.substring(11,19);
	var formatFecha = dia+'-'+mes+'-'+anio+' Hora: '+ hora;
	return formatFecha;
}//formatoFechaMensajes   