import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadFile = (file: Express.Multer.File): Promise<AWS.S3.ManagedUpload.SendData> => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    return s3.upload(params).promise();
};

export { uploadFile };
