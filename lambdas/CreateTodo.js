const AWS = require('aws-sdk')

// Create a client to access DynamoDB
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let response = {}
    
    // API requests will come in as strings, so this will convert it to JSON
    let body = event.body
    if(typeof(body) === "string") {
      body = JSON.parse(body)
    }
    
    // Define our parameters, including the table name and data to be sent
    const params = {
      TableName: "VueTodoApp",
      Item: body
    };
    
    // Use `put` to save our item to the database
    try {
      await client.put(params).promise()
      response = {
          statusCode: 201
      }
    } catch (err) {
      response = {
          statusCode: 500,
          body: err
      }
    }
    
    return response
};