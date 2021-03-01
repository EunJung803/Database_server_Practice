import bodyParser = require('body-parser');
import morgan = require('morgan');
import compression = require('compression');
import routes from './routes';

const config = require('./config');
const express = require("express");
const cors = require("cors");
const app = express();

app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());
app.use(morgan('dev'));
app.use(compression());

app.use('/', routes);

app.set('jwt-secret', config.secret);


export default app;