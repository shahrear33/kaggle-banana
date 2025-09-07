import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

const s3 = new AWS.S3();
const bucketName = 'bucketforfahim';

export async function uploadImage(file, fileName) {
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file
      };
    s3.upload(params, (err, data) => {
    if (err) {
        console.error('Error uploading file:', err);
    } else {
        return "successful"
    }
    });
}

export async function downloadImage(imageKey, setImageUrl) {
    const params = {
        Bucket: bucketName,
        Key: encodeURIComponent(imageKey),
        Expires: 60 * 60 * 60
      };
    const result = s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
        console.error('Error getting image URL:', err);
        setImageUrl(null)
    } else {
        setImageUrl(url)
    }
    })
    console.log(result, "something")
}