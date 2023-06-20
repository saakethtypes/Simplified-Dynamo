const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
// INFO query = {
//   pk: pk,
//   skBeginsWith: sk }

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
          ":filterValue": query.filter.value
        }
      : {
          ":pk": query.pk,
        },
    FilterExpression:`contains(${query.filter.key}, :filterValue)`
    // ReturnValues:"ALL"
    };
  try {
    let success = await db
      .query(params, (error) => {
        if (error) {
          return { status: false, error: error };
        }
      })
      .promise();
    return { status: true, data:success.Items[0] , exists: success.Count != 0};
  } catch (error) {
    return { status: false, error: error };
  }
};
