const getClient = require("../../gateway/dbClient");
const db = getClient();
const keys = require("../../configs/keys.json");

module.exports = async (query) => {
	let kce = "pk = :pk and sk = :sk";

	let params = {
		TableName: keys.prod.tableName,
		KeyConditionExpression: kce,
		ExpressionAttributeValues: {
			":pk": query.pk,
			":sk": query.sk,
		},
	};

	try {
		let success = await db
			.query(params, (error) => {
				if (error) {
					console.log("DYNAMO ERROR - GET ITEM - ", error);
					return { status: false, error: error };
				}
			})
			.promise();
		return {
			status: true,
			data: success.Items[0],
			exists: success.Count != 0,
		};
	} catch (error) {
		return { status: false, error: error };
	}
};
