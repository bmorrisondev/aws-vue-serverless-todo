// UpdateTodoFunction
const AWS = require('aws-sdk')

const client = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event) => {
    console.log(event.body)
    let response = {}
    
    let body = event.body
    if(typeof(body) === "string") {
        body = JSON.parse(body)
    }
    
    const params = {
      TableName: 'VueTodoApp',
      Key: {
        id: body.id
      },
      UpdateExpression: 'set #task_name = :name, imageUrl = :imageUrl',
      ExpressionAttributeValues: {
        ':name': body.name,
        ':imageUrl': body.imageUrl
      },
      ExpressionAttributeNames: {
        "#task_name": "name"
      },
      ReturnValues: 'UPDATED_NEW'
    };
    
    try {
        await client.update(params).promise()
        response = {
            statusCode: 200
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