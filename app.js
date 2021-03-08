const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');  // this is used for the every post and get requests loggings on console
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config'); // installed dotenv package
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors())    //(cross origin resource sharing)  

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);  

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;      // with the help of dotenv package we are using the api url
                                        // there is no need to export the env file

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})

//Server
app.listen(3000, ()=>{

    console.log('server is running http://localhost:3000');
})