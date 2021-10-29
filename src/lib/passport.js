import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import pool from '../database.js';
import { checkPasswords } from '../lib/helper.js';
import error_types from './error_types.js';

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  session: false
}, (username, password, done)=>{
  //console.log("//ejecutando *callback verify* de estategia local")
  pool.query('SELECT * FROM users WHERE email= ?', [username])
  .then(rows=>{
    /*el usuario no existe*/
      if(Object.entries(rows).length === 0){
        return done("Este usuario no esta registrado", false);
        }else{ /*si el usuario existe se verifica su password*/
          checkPasswords(password, rows[0].password)
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

export default passport;
