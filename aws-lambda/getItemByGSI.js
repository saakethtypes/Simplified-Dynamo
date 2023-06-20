const getClient = require("../../gateway/dbClient");
const db = getClient();
// require("dotenv").config();
const keys = require("../../configs/keys.json");

module.exports = async (query) => {
	let kce = `gsi${query.gsiAttrName}pk = :gsi${query.gsiAttrName}pk and gsi${query.gsiAttrName}sk = :gsi${query.gsiAttrName}sk`;
	let GSIExpAttr = {}
	GSIExpAttr[`:gsi${query.gsiAttrName}pk`] = query.gsiPk
	GSIExpAttr[`:gsi${query.gsiAttrName}sk`] = query.gsiSk
	let params = {
		TableName: keys.prod.tableName,
		IndexName: query.index,
		KeyConditionExpression: kce,
		ExpressionAttributeValues: GSIExpAttr,
	};

	try {
		let success = await db
			.query(params, (error) => {
				if (error) {
					return { status: false, error: error };
				}
			})
			.promise();
		return { status: true, data: success.Items[0], exists: success.Count != 0 };
	} catch (error) {
		return { status: false, error: error };
	}
};
