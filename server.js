import express from 'express';
import {router} from './routes';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/api', router);

app.get('/', (req, res) => {
    res.json('hello from express')
});

app.listen(9000, () => console.log('server is running on port 8000'));