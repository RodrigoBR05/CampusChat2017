/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	new:function (req, res){
		res.view();
	}, 
	create:function(req, res, next){

		var email = req.param('email');
		var password = req.param('password');
		//console.log(email+' - '+password);
		if (!email || !password) {
			var noEmailOrPasswordError = [{message: 'Debe ingresar su email y contraseña'}]
			req.session.flash = {
				err:noEmailOrPasswordError
			}
			return res.redirect('/session/new');
		}

		Si_user.findOneByEmail(email, function userFounded (err,user ){
			if (err) {
				req.session.flash = {
					err: err
				}
				return res.redirect('/session/new');
			}
			if (!user) {
				var noUserFoundedError = [{message:'El usuario no existe'}]
				req.session.flash = {
					err:noUserFoundedError
				}
				return res.redirect('/session/new');					
			}

			if (password !== user.password) {
				var passwordDoNotMatchError = [{message:'Las credenciales no son válidas'}]
				req.session.flash = {
					err:passwordDoNotMatchError
				}
				return res.redirect('/session/new');
			}else{
				//Hacer la sesión global
				req.session.authenticated = true;
				req.session.user = user;
				res.redirect('/chats/');
			}
				
		});
	},
	destroy: function(req, res, next){
		req.session.destroy();
		res.redirect('/session/new');
	}
	
};

