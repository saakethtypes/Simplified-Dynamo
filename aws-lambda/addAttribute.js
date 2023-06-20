"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

module.exports.testItem = async (event, context, callback) => {
  async function scanDB(params) {
    let dynamoContents = [];
    let items;
    // do{
    items = await dynamoDb.query(params).promise();
    items.Items.forEach((item) => dynamoContents.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
    // }while(typeof items.LastEvaluatedKey != "undefined");
    return dynamoContents;
  }

  let tableContents;
  try {
    //get items from dynamo
    const params = {
      TableName: "moving-dev",
      KeyConditionExpression: "pk = :string",
      ExpressionAttributeValues: {
        ":string": "user",
      },
    };
    tableContents = await scanDB(params);
  } catch (err) {
    return err;
  }
  let calls = [];
  let propic = "";
  tableContents.forEach(async function (value) {
    propic = await dynamoDb
      .query({
        TableName: "moving-dev",
        KeyConditionExpression: "pk = :string and sk = :string1",
        ExpressionAttributeValues: {
          ":string": value.pk,
          ":string1": value.sk,
        },
      })
      .promise();
    propic = propic.Items[0].profile_image;
    let buckLink = propic.split("profile/");
    let params = {
      ExpressionAttributeValues: {
        ":newAttribute":
          buckLink[0] +
          "profile/" +
          buckLink[1].split(".")[0] +
          "_icon." +
          buckLink[1].split(".")[1],
      },
      Key: {
        pk: value.pk,
        sk: value.sk,
      },
      TableName: "moving-dev",
      UpdateExpression: "SET profile_image = :newAttribute",
    };
    calls.push(dynamoDb.update(params).promise());
  });
  let response;
  try {
    response = await Promise.all(calls);
  } catch (err) {
    console.log("err", err);
  }
  callback(null, { propic });
  return response;
};

module.exports.addAttr = async (event, context, callback) => {
  async function scanDB(params) {
    let dynamoContents = [];
    let items;
    // do{
    items = await dynamoDb.query(params).promise();
    items.Items.forEach((item) => dynamoContents.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
    // }while(typeof items.LastEvaluatedKey != "undefined");
    return dynamoContents;
  }

  let tableContents;
  try {
    //get items from dynamo
    const params = {
      TableName: "moving-dev",
      KeyConditionExpression: "pk = :string",
      ExpressionAttributeValues: {
        ":string": "user",
      },
    };
    tableContents = await scanDB(params);
  } catch (err) {
    return err;
  }
  let calls = [];
  tableContents.forEach(async function (value) {
    let params = {
      ExpressionAttributeValues: {
        ":newAttribute": 0,
      },
      Key: {
        pk: value.pk,
        sk: value.sk,
      },
      TableName: "moving-dev",
      UpdateExpression: "SET following_count = :newAttribute",
    };
    calls.push(dynamoDb.update(params).promise());
  });
  let response;
  try {
    response = await Promise.all(calls);
  } catch (err) {
    console.log("err", err);
  }
  callback(null, {});
  return response;
};
