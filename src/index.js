const express = require('express');
//const morgan = require('morgan'); // desactivar en prod
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const customMdw = require('./middleware/custom');


//inicialization
const app = express();

require('./lib/passport');


// Settings
app.set('port', process.env.PORT || 3000);

// MiddLewares
//*app.use(morgan('common'));    // desactivar en prod
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Global Variables


// Routes

app.use('/api/v1', require('./routes/api.js'), require('./routes/api-pay.js'));

app.get('*',(req,res)=>{
  res.status(404).send('default backend - 404')
})

app.use(customMdw.errorHandler);


// Listen Server
app.listen(app.get('port'), () => {
  console.log('Server on Port', app.get('port'));
});
