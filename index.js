'use strict';

const AWS = require('aws-sdk');
const DOC = require('dynamodb-doc');

const awsClient = AWS.DynamoDB();
const docClient = new DOC.DynamoDB(awsClient);

const dynamo = new docClient.DynamoDB();

exports.saveUser = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  switch (event.httpMethod) {
    case 'POST':
      const { Id, Email, Name } = JSON.parse(event.body);

      const dynamoParams = {
        TableName: event.queryStringParameters.ServerlessUsersTable,
        Item: {
          Id,
          Email,
          Name,
        },
      };

      dynamo.putItem(dynamoParams, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};

exports.handlePlaylist = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  switch (event.httpMethod) {
    case 'GET':
      const dynamoParams = {
        TableName: event.queryStringParameters.ServerlessPlaylistTable,
        IndexName: 'PlaylistIndex',
        KeyConditionExpression: 'Playlist = :Playlist',
        ExpressionAttributeValues: {
          ':Playlist': event.queryStringParameters.playlist,
        },
      };

      dynamo.query(dynamoParams, done);
      break;
    case 'POST':
      const { Id, Songs } = event.body;
      const dynamoParams = {
        TableName: event.queryStringParameters.ServerlessPlaylistTable,
        Item: {
          Id,
          Songs,
        },
      };

      dynamo.put(dynamoParams, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
