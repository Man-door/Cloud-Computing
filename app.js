
const express = require('express');
const db = require('./models');
const registerUserRoute = require('./src/register');
const loginUserRoute = require('./src/login');
const registerMandorRoute = require('./src/regmandor');
const loginMandorRoute = require('./src/logmandor');
const newsRoute = require('./src/news');

const app = express();
app.use(express.json());


app.use('/register', registerUserRoute);
app.use('/login', loginUserRoute);      

app.use('/regmandor', registerMandorRoute);
app.use('/logmandor', loginMandorRoute);

app.use('/news', newsRoute); 

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch(err => console.error('Failed to sync database:', err));
