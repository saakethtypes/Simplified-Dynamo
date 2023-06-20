const getClient = require("../../gateway/dbClient");
const db = getClient();
const keys = require("../../configs/keys.json");
// INFO query = {
//   pk: pk,
//   skBeginsWith: sk,
//   byLatestOrder: true }

module.exports = async (query) => {
	let lek = query.lastKeySeen ? query.lastKeySeen : null;
	lek = lek ? (lek.pk.length > 2 ? lek : null) : null;

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
		FilterExpression: query.condition ? query.condition:null,
		ScanIndexForward: query.byLatestOrder,
		Limit: query.limit,
		ExclusiveStartKey: lek ? lek : null,
	};
	let condition = query.condition?params.ExpressionAttributeValues[`:false`] = false:null

	if (query.filterExpression) {
		params["FilterExpression"] = "";
		Object.keys(query.filterExpression).map((attr) => {
			params.ExpressionAttributeValues[`:${attr}`] =
				query.filterExpression[attr];
		});
		Object.keys(query.filterExpression).map((attr) => {
			params.FilterExpression += ` ${attr} = :${attr} `;
		});
	}

	try {
		let success = await db.query(params).promise();

		return {
			status: true,
			data: success.Items,
			exists: success.Count != 0,
			count:success.Count,
			lastKeySeen: success.LastEvaluatedKey ? success.LastEvaluatedKey : {},
		};
	} catch (error) {
		return { status: false, error: error.stack };
	}
};
