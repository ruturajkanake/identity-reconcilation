import express, { Request, Response, Express } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import connection from './config/connect';
import { createContact } from './controllers/contact.controller';

config();
const app: Express = express();

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Hello World!');
});

app.post('/identify', (req: Request, res: Response) => {
    createContact(req, res);
});

connection
    .sync()
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log('Error connecting to database', err);
    });

const port: number = parseInt(process.env.PORT!) || 3000;
const server = app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);

export default server;
