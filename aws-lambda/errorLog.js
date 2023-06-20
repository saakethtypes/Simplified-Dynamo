const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
const { ulid } = require("ulid");
const updateItem = require("./updateItem");
//INFO {pk,sk}
module.exports = async (data) => {
	// let params = {
	// 	TableName: keys.prod.tableName,
	// 	Item: {
	// 		pk: "errorLog",
	// 		sk: "log#" + data.category + "#" + ulid(),
	// 		error: data.error,
	// 	},
	// };
	console.log("ERROR", data);
	// try {
	// 	let updatedItem = {}
	// 	updatedItem[`${data.category}API`] = false
	// 	await updateItem({pk:"plug",sk:"api"},updatedItem)
	// 	let success = await db
	// 		.put(params, (error) => {
	// 			if (error) {
	// 				return { status: false, error: error, exists: false };
	// 			}
	// 		})
	// 		.promise();
	// 	return { status: true, data: success, exists: true };
	// } catch (error) {
	// 	return { status: false, error: error, exists: false };
	// }
};
