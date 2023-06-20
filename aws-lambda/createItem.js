const getClient = require("../../gateway/dbClient");
const db = getClient();
// require("dotenv").config();
const keys = require("../../configs/keys.json");

module.exports = async (data, isUnique) => {

	let params = {};
	if (isUnique) {
		params = {
			TableName: keys.prod.tableName,
			Item: data,
			ConditionExpression: `attribute_not_exists(sk)`,
		};
	} else {
		params = {
			TableName: keys.prod.tableName,
			Item: data,
		};
	}

	try {
		let success = await db
			.put(params)
			.promise();
		return { status: true, data: success };
	} catch (error) {
		return { status: false, error: error };
	}
};
