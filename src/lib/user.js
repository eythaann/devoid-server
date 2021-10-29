'use strict'
import passport from 'passport';
import jwt from 'jsonwebtoken';

import pool from '../database.js';

import {encryptPasswords} from './helper.js';
import error_types from './error_types.js';



    /*Podríamos haber realizado el registro pasando por el middleware de passport, pero en este caso 
    se realiza contra una base de datos asi que es muy sencillo hacerlo nosotros.*/

    export let register = (req, res, next) => {
        //console.log("caso register");
        pool.query('SELECT * FROM users WHERE email= ?', [req.body.email])
        .then(rows => { //si la consulta se ejecuta
                if (Object.entries(rows).length === 1) { //si el usuario existe
                    throw new error_types.InfoError("Este correo ya esta registrado");
                }
                else { //si no existe el usuario se crea/registra
                    console.log("\x1b[32m%s\x1b[0m" ,"Creando Nuevo Usuario");
                    encryptPasswords(req.body.password)
                    .then(hash=>{
                        const document = {
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                        };
                    pool.query('INSERT INTO users set ?', [document])
                    .then(data => { //usuario registrado con exito, pasamos al siguiente manejador
                        login(req, res, next)
                    })
                    })
                }
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    }


    export let login = (req, res, next) => {
        //console.log("caso login");
        passport.authenticate("local", { session: false }, (error, user) => {
            //console.log("ejecutando *callback auth* de authenticate para estrategia local");
            /*si hubo un error en el callback verify relacionado con la consulta de datos de usuario*/
            if (error || !user) {
                next( new error_types.Error404(error))
            }else {
                //console.log("*** comienza generacion token*****");
                const payload = {
                    id: user.id,
                    exp: Date.now(),
                    username: user.email,
                    name: user.username
                };

                const token = jwt.sign(JSON.stringify(payload), 'secret');
                res.json({ auth: true, token: token, user: user.username});
            }

        })(req, res);
    }




