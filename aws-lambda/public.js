"use strict";
// SEC API Imports
const createUser = require("../api/user/user/createUser");
const loginUser = require("../api/user/user/loginUser");
const checkMobile = require("../api/user/user/checkMobile");
const checkUsername = require("../api/user/user/checkUsername");
const version = require("../api/app/discover/version");
const renewAccess = require("../api/user/user/renewAccess");
const logoutUser = require("../api/user/user/logoutUser");

module.exports.public = (event, context, callback) => {
	try {
		let data = event.body;
		let apiType = data.api_type;
		console.log("API CALL - ", apiType);

		switch (apiType) {
			case "REGISTER":
				createUser(data, callback);
				break;

			case "VERSION":
				version(data, callback);
				break;

			case "LOGIN":
				loginUser(data, callback);
				break;

			case "LOGOUT":
				logoutUser(data, callback);
				break;	
				
			case "RENEW_ACCESS":
				renewAccess(data, callback);
				break;

			case "CHECK_MOBILE":
				checkMobile(data, callback);
				break;

			case "CHECK_USERNAME":
				checkUsername(data, callback);
				break;
			
			default:
				callback(null, {
					statusCode: 400,
					body: "api_type is missing from request",
				});
				return;
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};
