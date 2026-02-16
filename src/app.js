const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const exphbs = require('express-handlebars');

// Config .env
dotenv.config();

// Conexión a Mongo
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: {
    multiply: function (a, b) {
      return a * b;
    }
  }
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Ruta por defecto
app.get('*', (req, res) => {
  res.status(404).send('Ruta no encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
