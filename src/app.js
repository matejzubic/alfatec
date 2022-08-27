import express from 'express'
import * as path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
import './models/Souvenir.js'
import {initiDB} from './db.js'
import dotenv from 'dotenv'
dotenv.config();
import router from './routes/products.routes.js';
import bodyParser from 'body-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'

// Initiating express
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Get path to current file
const __filename = fileURLToPath(import.meta.url);

// Set base dir name
const __dirname = path.dirname(__filename);

// Set express to be used
app.use(express.json());

// Set ejs view engine
app.set('view engine', 'ejs');

// Set up views folder to use to display view templates
app.set('views', path.join(__dirname, 'views'));

// Set up public dir for style and other scripts
app.use(express.static(__dirname + '/public')); 

await mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

await mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// Set up store session in Mongo DB using connect-mongo module
app.use(session({
  store: MongoStore.create({
    mongoUrl : 'mongodb://localhost:27017/alfatec'
  }),
  secret: 'alfatec',
  resave : false,
  saveUninitialized: true,
  unset: 'destroy'
}));

// Set up routes for our services
app.use(router);

// App is run on port 3000 so just run http://localhost:3000/ to start app
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    // Create products table and populate on init
    await initiDB();
    
    console.log(`Our app is running on port ${ PORT }`);
});