// DeleteTodoFunction
const AWS = require('aws-sdk')

const client = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
    let response = {}
    
    let body = event.body
    if(typeof(body) === "string") {
      body = JSON.parse(body)
    }
    
    // We need to reference the primary key like so
    const params = {
      TableName: "VueTodoApp",
      Key: {
        id: body.id
      }
    };

    // Use the delete function to delete the item with the specified id
    try {
      await client.delete(params).promise()
      response = {
          statusCode: 200
      }
    } catch (err) {
      response = {
          statusCode: 500,
          body: err
      }
    }
    
    return response
};