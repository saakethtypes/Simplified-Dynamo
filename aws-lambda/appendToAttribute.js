const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
const errorLog = require("./errorLog");

module.exports = async (key, attr, addedData) => {
	const params = {
		TableName: keys.prod.tableName,
		Key: {
			pk: key.pk,
			sk: key.sk,
		},
		ExpressionAttributeValues: {
			//":updatedAt": Date.now(),
			":addedData": addedData,
		},

		ExpressionAttributeNames: {
			"#attr": attr,
		},
		ExpressionAttributeValues: {
			":appendedData": [
				addedData
			],
		},
		UpdateExpression: `SET #attr = list_append(#attr, :appendedData)`,
		ReturnValues: "ALL_NEW",
	};
	try {
		let success = await db
			.update(params)
			.promise()
			.then((data) => {
				if (data) {
					return { status: true, data: data, exists: true };
				}
			});
		return { status: true, data: success, exists: true };
	} catch (error) {
		await errorLog({category:"helperATA",error:error.stack})
		return { status: false, error: error, exists: false };
	}
};
