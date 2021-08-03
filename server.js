require("dotenv").config();
var morgan = require('morgan')
const express = require('express'),
   app = express(),
   bodyParser = require('body-parser');
port = process.env.PORT || 3000;
app.listen(port);

console.log('API server started on: ' + port);

app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes/categoryRoutes'); //importing route
var routesNft = require('./routes/nftRoutes');
var collectionRoutes = require('./routes/collectionRoutes');
var itemRoutes = require('./routes/itemRoutes');
var userRoutes = require('./routes/userRoutes');

routes(app); //register the route
routesNft(app);
collectionRoutes(app)
itemRoutes(app)
userRoutes(app)