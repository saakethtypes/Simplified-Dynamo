const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
const errorLog = require("./errorLog");

module.exports = async (query) => {
	try {
		let lek = query.lastKeySeen ? query.lastKeySeen : null;
		// frontend conditional check
		lek = lek ? (lek.pk.length > 2 ? lek : null) : null;
		let GSIExpAttr = {};
		GSIExpAttr[`:gsi${query.gsiAttrName}pk`] = query.gsiPk;
		GSIExpAttr[`:gsi${query.gsiAttrName}sk`] = query.gsiSkBeginsWith;
		query.condition ? (GSIExpAttr[`:false`] = false) : null;
		let reconstructedLek = {};
		if (lek) {
			reconstructedLek[`gsi${query.gsiAttrName}pk`] = lek.pk;
			reconstructedLek[`gsi${query.gsiAttrName}sk`] = lek.sk;
			switch (query.gsiPk) {
				// Event split
				case "event":
					reconstructedLek["pk"] = "event";
					reconstructedLek["sk"] = "event#" + lek.sk.split("#")[3];
					break;
				case "username":
					reconstructedLek["pk"] = lek.actual_pk;
					reconstructedLek["sk"] = lek.actual_sk;
					break;
				
				case query.gsiPk.startsWith("user#"):
					reconstructedLek["pk"] = lek.actual_pk;
					reconstructedLek["sk"] = lek.actual_sk;
					break;

				default:
					break;
			}
		}
		let params = {
			TableName: keys.prod.tableName,
			IndexName: query.index,
			KeyConditionExpression: `gsi${query.gsiAttrName}pk = :gsi${query.gsiAttrName}pk and begins_with(gsi${query.gsiAttrName}sk,:gsi${query.gsiAttrName}sk)`,
			ExpressionAttributeValues: GSIExpAttr,
			FilterExpression: query.condition ? query.condition : null,
			Limit: query.limit ? query.limit : 40,
			ExclusiveStartKey: lek ? reconstructedLek : null,
			ScanIndexForward: query.byLatestOrder ? !query.byLatestOrder : false,
		};

		let success = await db.query(params).promise();
		let returnedLek = success.LastEvaluatedKey
			? {
					pk: success.LastEvaluatedKey[`gsi${query.gsiAttrName}pk`],
					sk: success.LastEvaluatedKey[`gsi${query.gsiAttrName}sk`],
					actual_pk: success.Items[success.Items.length - 1]["pk"],
					actual_sk: success.Items[success.Items.length - 1]["sk"],
			  }
			: {};
		return {
			status: true,
			data: success.Items,
			exists: success.Count != 0,
			lastKeySeen: returnedLek,
			error: false,
		};
	} catch (error) {
		await errorLog({ category: "helperGSIList", error: error.stack });
		return { status: false, error: { params, query, e: error.stack } };
	}
};

