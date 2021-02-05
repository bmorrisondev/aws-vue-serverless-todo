// ListTodosFunction
const AWS = require('aws-sdk')

const client = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
    let response = {}
    const params = {
      TableName: "VueTodoApp"
    };

    // Use the scan function to get ALL data from our table
    try {
      let data = await client.scan(params).promise();
      response = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data.Items)
      }
    } catch (err) {
      response = {
        statusCode: 500,
          headers: {
            "Content-Type": "application/json"
          },
          body: err.toString()
      }
    }
    
    return response
};