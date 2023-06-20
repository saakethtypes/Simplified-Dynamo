const getClient = require("../../gateway/dbClient");
const db = getClient();
const keys = require("../../configs/keys.json");

module.exports = async (key, data) => {
	data["api_type"] ? delete data["api_type"] : null;
	let expressionNames = {};
	Object.keys(data).map((attr) => {
		expressionNames[`#${attr}`] = attr;
	});

	let expressionValues = {};
	Object.keys(data).map((attr) => {
		expressionValues[`:${attr}`] = data[attr];
	});

	let expression = "SET ";
	Object.keys(data).map((attr) => {
		expression += `#${attr} = :${attr}, `;
	});
	expression = expression.slice(0, -2);

	let params = {
		TableName: keys.prod.tableName,
		Key: {
			pk: key.pk,
			sk: key.sk,
		},
		ExpressionAttributeNames: expressionNames,
		ExpressionAttributeValues: expressionValues,
		UpdateExpression: expression,
		ReturnValues: "ALL_NEW",
	};
	try {
		let success = await db
			.update(params, (error) => {
				if (error) {
					return { status: false, error: error, exists: false };
				}
			})
			.promise();
		return { status: true, data: success, exists: true };
	} catch (error) {
		return { status: false, error: error, exists: false };
	}
};

