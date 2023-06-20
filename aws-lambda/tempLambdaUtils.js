const getClient = require("../../gateway/dbClient");
const db = getClient();
const keys = require("../../configs/keys.json");
const respond = require("../responses/respond");
const responses = require("../responses/responses.json");
const updateItem = require("../functions/updateItem");

require("dotenv").config();

module.exports = async (event, callback) => {
	var params = {
		TableName: keys.prod.tableName,
		Select: "ALL_ATTRIBUTES",
		IndexName: "username-index",
		Limit: 25,
		KeyConditionExpression: "gsi1pk = :string",
		ExpressionAttributeValues: {
			":string": "username",
		},
		FilterExpression: "gsi1pk = :string",
		ExclusiveStartKey: event.lek ? event.lek : null,
	};
	try {
		let success = await db
			.scan(params, (error) => {
				if (error) {
					return { status: false, error: error };
				}
			})
			.promise();
		let allItems = success;
		let f = {}
		for (let i = 0 ; i < 25; i++) {
			let item = allItems.Items[i];
			f = await updateItem(
				{ pk: item.pk, sk: item.sk },
				{
					curatorRequested:false,
				}
			);
		}

		responses.apiSuccess.message = "Done";
		responses.apiSuccess.responseData = {
			f,
			lek: success.LastEvaluatedKey,
		};
		respond(responses.apiSuccess, callback);
		return;
	} catch (error) {
		responses.custom.responseData = { err: error.stack };
		respond(responses.custom, callback);
		return;
	}
};
