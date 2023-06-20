const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
//INFO {pk,sk}
module.exports = async (data) => {
	let params = {
			TableName: keys.prod.tableName,
			Key: data,
			// ConditionExpression: `attribute_exists(sk)`,
		};

  try {
    let success = await db
      .delete(params, (error) => {
        if (error) {
          return { status: false, error: error , exists:false };
        } 
      })
      .promise();
    return { status: true, data:success , exists:true };
  } catch (error) {
    return { status: false, error: error , exists:false};
  }
};
 