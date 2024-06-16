var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield s3.putObject({
            Bucket: 'spotifysaruar',
            Key: 'my_text.txt',
            Body: 'Hello, World!',
        }).promise();
        console.log('File uploaded successfully');
    }
    catch (error) {
        console.error('Error uploading file:', error);
    }
}))();
