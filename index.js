const AWS = require('aws-sdk');
AWS.config.update({
    region: 'eu-north-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const watchTable = 'watch-inventory';
const healthPath = '/health';
const watchPath = '/watch';
const watchsPath = '/watchs';

exports.handler = async function(event) {
    console.log('Request event: ', event);
    let response;
    
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200);
            break;
        case event.httpMethod === 'GET' && event.path === watchPath:
            response = await getWatch(event.queryStringParameters.watchID);
            break;
        case event.httpMethod === 'GET' && event.path === watchsPath:
            response = await getWatchs();
            break;
        case event.httpMethod === 'POST' && event.path === watchPath:
            response = await addWatch(JSON.parse(event.body));
            break;
        case event.httpMethod === 'PATCH' && event.path === watchPath:
            let requestBody = JSON.parse(event.body);
            response = await modifyWatch(requestBody.watchID, requestBody.updateKey, requestBody.updateValue);
            break;        
        case event.httpMethod === 'DELETE' && event.path === watchPath:
            response = await deleteWatch(JSON.parse(event.body).watchID);
            break;        
        default: 
            response = buildResponse(404, 'NOT FOUND');      

    }
    return response;
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}

async function getWatch(watchID) {
    const params = {
      TableName: watchTable,
      Key: {
        'watchID': parseInt(watchID, 10)
      }
    }
    return await dynamodb.get(params).promise().then((response) => {
      console.log('response is: ', response);
      console.log('responseItem is: ', response.Item);
      return buildResponse(200, response.Item);
    }, (error) => {
      console.error('Unable to get a watch ', error);
    });
  }

async function getWatchs() {
    const params = {
        TableName: watchTable
    }
    const allWatchs = await scanTableRecords(params, []);
    const body = {
        watchs: allWatchs
    }
    
    return buildResponse(200, body);
}


// In DynamoDB, you can scan certain amount records in a table
async function scanTableRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if(dynamoData.LastEvaluatedKey) {
            scanParams.ExclusivedStartKey = dynamoData.LastEvaluatedKey;
            return await scanTableRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch(error) {
        console.error('Unable to get table records', error);
    }
}

async function addWatch(requestBody) {
    const params = {
        TableName: watchTable,
        Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'ADD', 
            Message: 'SUCCESS',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Unable to add watch record to table', error);
    })
}

async function modifyWatch(watchID, updateKey, updateValue) {
    const params = {
        TableName: watchTable,
        Key: {
            watchID: parseInt(watchID, 10)
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATEED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE', 
            Message: 'SUCCESS',
            UpdatedAttributes: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Unable to modify watch record to table', error);
    })
}

async function deleteWatch(watchID) {
    const params = {
        TableName: watchTable,
        Key: {
            'watchID': parseInt(watchID, 10)
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE', 
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('Unable to delete watch record from table', error);
    })
}

