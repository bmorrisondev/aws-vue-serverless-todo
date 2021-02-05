// UploadImageFunction
const AWS = require('aws-sdk')

const region = "us-east-1"
const bucketName = "vue-todo-app-images"

const putObjectToS3 = function (bucket, key, contentType, data){
  return new Promise((resolve, reject) => {
    let s3 = new AWS.S3();
    var params = {
      Bucket : bucket,
      Key : key,
      Body : data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: contentType
    }
    s3.putObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
}

exports.handler = async (event) => {
    let response = {}
    
    // API requests will come in as strings, so this will convert it to JSON
    let body = event.body
    if(typeof(body) === "string") {
      body = JSON.parse(body)
    }
    
    try {
        // The `key` is the location in S3 where the file will be stored
        const key = `${new Date().getFullYear()}/${body.fileName}`
    
        // We're using some regex to extract the contentType and the image data to store in S3
        const contentType = body.fileData.split(';')[0].split(':')[1];
        const blobData = new Buffer.from(body.fileData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    
        // Pass in the S3 bucket name and other variables to save the object to S3
        await putObjectToS3(bucketName, key, contentType, blobData)
    
        // Create the URL to send back. The format to use is https://bucket-name.s3.Region.amazonaws.com/key-name
        let imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
      response = {
          statusCode: 201,
          body: JSON.stringify({ imageUrl })
      }
    } catch (err) {
      console.log(err)
      response = {
          statusCode: 500,
          body: err
      }
    }
    
    return response
};