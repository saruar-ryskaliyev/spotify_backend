import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import json  from 'body-parser';
import router from './global-router';
import connectDb from './db';
import songRoutes from './song/routes/songRoutes';


dotenv.config();

connectDb();

const app = express();
app.use(cors({
    origin: 'localhost:3000'
}));
app.use(json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api', router);
app.use('/api/songs', songRoutes);

app.listen(8000, () => {
    console.log('Server running on port 8000');
});



// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });
// (async () => {
//     try {
//         await s3.putObject({
//             Bucket: 'spotifysaruar',
//             Key: 'my_text.txt',
//             Body: 'Hello, World!',
//         }).promise();
//         console.log('File uploaded successfully');
//     } catch (error) {
//         console.error('Error uploading file:', error);
//     }
// })();
