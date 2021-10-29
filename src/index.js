import express, { urlencoded, json } from 'express';
import morgan from 'morgan'; // desactivar en prod
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/custom.js';
import api from './routes/api.js';
import apipay from './routes/api-pay.js'

//inicialization
const app = express();
import passport from './lib/passport.js';

// Settings
app.set('port', process.env.PORT || 3000);

// MiddLewares
app.use(morgan('common'));    // desactivar en prod
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(passport.initialize());

// Global Variables


// Routes

app.use('/api/v1', api, apipay);

app.get('*',(req,res)=>{
  res.status(404).send('default backend - 404')
})

app.use(errorHandler);


// Listen Server
app.listen(app.get('port'), () => {
  console.log('Server on Port', app.get('port'));
});
