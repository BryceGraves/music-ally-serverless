'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.saveUser = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  switch (event.httpMethod) {
    case 'POST':
      const { Id, Email, Name } = JSON.parse(event.body);

      const saveUserPostParams = {
        TableName: event.queryStringParameters.ServerlessUsersTable,
        Item: {
          Id,
          Email,
          Name,
        },
      };

      dynamo.putItem(saveUserPostParams, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};

exports.handlePlaylist = (event, context, callback) => {
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
      const playlistGetParams = {
        TableName: event.queryStringParameters.ServerlessPlaylistTable,
        IndexName: 'PlaylistIndex',
        KeyConditionExpression: 'Playlist = :Playlist',
        ExpressionAttributeValues: {
          ':Playlist': event.queryStringParameters.playlist,
        },
      };

      dynamo.query(playlistGetParams, done);
      break;
    case 'POST':
      const { Id, Songs } = event.body;
      const savePlaylistPostParams = {
        TableName: event.queryStringParameters.ServerlessPlaylistTable,
        Item: {
          Id,
          Songs,
        },
      };

      dynamo.put(savePlaylistPostParams, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
