import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import helpers from 'handlebars-helpers';
helpers(['string', 'path', 'math', 'number', 'array'])

import route from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000



// Template engine
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        slice: (str) => {
            return str.slice(32, )
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', './src/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());       
app.use(express.urlencoded({extended: true}));

app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}`));

route(app)
