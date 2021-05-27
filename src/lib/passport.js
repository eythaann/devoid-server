const passport          = require("passport");
const LocalStrategy     = require('passport-local').Strategy;
const pool = require('../database');
const helper = require('../lib/helper');
const error_types = require('./error_types');

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  session: false
}, (username, password, done)=>{
  //console.log("//ejecutando *callback verify* de estategia local")
  const rows = pool.query('SELECT * FROM users WHERE email= ?', [username])
  .then(rows=>{
    /*el usuario no existe*/
      if(Object.entries(rows).length === 0){
        return done("Este usuario no esta registrado", false);
        }else{ /*si el usuario existe se verifica su password*/
          comparado = helper.checkPasswords(password, rows[0].password)
          .then(comparado=>{
            if(comparado){/*---si coincide la password---*/
              return done(null, rows[0]);
            } else { /*---no coincide la password---"*/
              return done("Contraseña incorrecta", false)
            }
          })
        }
  })
  /* error en DB */
  .catch(err=>done(err, null)) 
}));

module.exports = passport;
