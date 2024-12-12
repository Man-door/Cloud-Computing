const express = require('express');
const db = require('./models');
const registerUserRoute = require('./server/register.js');
const loginUserRoute = require('./server/login.js');
const newsRoute = require('./server/news.js');
const filterRoute = require('./server/filtered.js');

const app = express();
app.use(express.json());

app.use('/register', registerUserRoute);
app.use('/login', loginUserRoute);
app.use('/news', newsRoute);
app.use('/filtermandor', filterRoute);

const PORT = process.env.PORT || 3000;
const HOST = 'localhost'; 

db.sequelize.sync()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch(err => console.error('Failed to sync database:', err));
