'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

const dynamo = new AWS.DynamoDB.DocumentClient();

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://notey-mcnoteface.firebaseio.com',
});

https: exports.saveUser = (event, context, callback) => {
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
        TableName: 'users',
        Item: {
          Id,
          Email,
          Name,
        },
      };

      dynamo.put(saveUserPostParams, done);
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
        'Access-Control-Allow-Origin': '*',
      },
    });

  switch (event.httpMethod) {
    case 'GET':
      const playlistGetParams = {
        TableName: 'playlist',
        IndexName: 'PlaylistIndex',
        KeyConditionExpression: 'Playlist = :Playlist',
        ExpressionAttributeValues: {
          ':Playlist': event.queryStringParameters.playlist,
        },
      };

      admin
        .auth()
        .verifyIdToken(event.queryStringParameters.Id)
        .then(() => {
          dynamo.query(playlistGetParams, done);
        })
        .catch((error) => {
          done(new Error(error));
        });
      break;
    case 'POST':
      const { Id, Songs } = event.body;
      const savePlaylistPostParams = {
        TableName: 'playlist',
        Item: {
          Id,
          Songs,
        },
      };

      admin
        .auth()
        .verifyIdToken(idToken)
        .then(() => {
          dynamo.put(savePlaylistPostParams, done);
        })
        .catch((error) => {
          done(new Error(error));
        });

      dynamo.put(savePlaylistPostParams, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
