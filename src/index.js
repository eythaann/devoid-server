const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const customMdw = require('./middleware/custom');


//inicialization
const app = express();

require('./lib/passport');


// Settings
app.set('port', process.env.PORT || 3000);

// MiddLewares
app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Global Variables
app.use((req, res, next) => {
  next();
});

// Publics


// Routes

app.use('/api/v1', require('./routes/api.js'), require('./routes/api-pay.js'));


app.use(customMdw.errorHandler);


// Listen Server
app.listen(app.get('port'), () => {
  console.log('Server on Port', app.get('port'));
});
