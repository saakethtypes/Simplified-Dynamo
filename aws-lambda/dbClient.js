var AWS = require("aws-sdk");
AWS.config.update({
	httpOptions: {
		timeout: 30000,
		connectTimeout: 30000
	}
})
var client = null;
/**
 * AWS DynamoDB Client
 * @returns {AWS.DynamoDB.DocumentClient}
 */
module.exports = function () {
	if (client) return client;
	client = new AWS.DynamoDB.DocumentClient({
		region: "ap-south-1"
	});
	return client;
};
