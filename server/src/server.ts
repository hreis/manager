  
import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';

import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );
app.use(cors());

app.use(routes);

app.listen(3333);