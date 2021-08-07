require("dotenv").config();
const morgan = require('morgan')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const express = require('express'),
   app = express(),
   bodyParser = require('body-parser');

port = process.env.PORT || 3000;
app.listen(port);

console.log('API server started on: ' + port);

app.use(fileUpload({
   createParentPath: true,
   limits: {
      fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
   },
}));
app.use(cors());
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

var routes = require('./routes/categoryRoutes'); //importing route
var routesNft = require('./routes/nftRoutes');
var collectionRoutes = require('./routes/collectionRoutes');
var itemRoutes = require('./routes/itemRoutes');
var userRoutes = require('./routes/userRoutes');
var fileRoutes = require('./routes/fileRoutes');
var favoriteRoutes = require('./routes/favoriteRoutes');

routes(app); //register the route
routesNft(app);
collectionRoutes(app)
itemRoutes(app)
userRoutes(app)
fileRoutes(app)
favoriteRoutes(app)