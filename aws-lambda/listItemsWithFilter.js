const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
// INFO query = {
//   pk: pk,
//   skBeginsWith: sk,
//   byLatestOrder: true }

module.exports = async (query) => {
  let params = {
    TableName: keys.prod.tableName,
    KeyConditionExpression: query.skBeginsWith
      ? "pk = :pk and begins_with(sk,:sk)"
      : "pk = :pk",
    ExpressionAttributeValues: query.skBeginsWith
      ? {
          ":pk": query.pk,
          ":sk": query.skBeginsWith,
        }
      : {
          ":pk": query.pk,
        },
    FilterExpression: "",
    ScanIndexForward: query.byLatestOrder ? !query.byLatestOrder : false,
  };

  
  Object.keys(query.filterExpression).map((attr) => {
    params.ExpressionAttributeValues[`:${attr}`] = query.filterExpression[attr];
  });
  Object.keys(query.filterExpression).map((attr) => {
    params.FilterExpression += ` ${attr} = :${attr} `;
  });
  
  try {
    let success = await db
      .query(params, (error) => {
        if (error) {
          return { status: false, error: error };
        }
      })
      .promise();
    return { status: true, data: success.Items, exists: success.Count != 0 };
  } catch (error) {
    return { status: false, error: error };
  }
};
