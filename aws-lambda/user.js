"use strict";
//API Imports
const getUserProfile = require("../api/user/social/getUserProfile");
const deleteUser = require("../api/user/user/deleteUser");
const searchUser = require("../api/user/social/searchUser");
const updateProfile = require("../api/user/social/updateProfile");
const listFollowers = require("../api/user/social/listFollowers");
const listFollowing = require("../api/user/social/listFollowing");
const followProfile = require("../api/user/social/followProfile");
const earlyAccess = require("../api/user/social/earlyAccess");
const listNotification = require("../api/user/social/listNotification");
const panVerify = require("../api/user/user/panVerify");
const curatorRequest = require("../api/user/user/curatorRequest");

module.exports.user = (event, context, callback) => {
	try {
		let data = event.body;
		let apiType = data.api_type;
		console.log("API CALL - ", apiType);

		switch (apiType) {
			case "GET_PROFILE":
				getUserProfile(data, callback);
				break;

			case "SEARCH_USER":
				searchUser(data, callback);
				break;

			case "UPDATE_USER":
				updateProfile(data, callback);
				break;

			case "CURATOR_REQUEST":
				curatorRequest(data, callback);
				break;

			case "DELETE_USER":
				deleteUser(data, callback);
				break;

			case "KYC_VERIFY":
				panVerify(data, callback);
				break;
			
			case "FOLLOW_USER":
				followProfile(data, callback);
				break;

			case "FOLLOWING_LIST":
				listFollowing(data, callback);
				break;

			case "FOLLOWERS_LIST":
				listFollowers(data, callback);
				break;

			case "EARLY_ACCESS":
				earlyAccess(data, callback);
				break;

			case "LIST_NOTIFICATIONS":
				listNotification(data, callback);
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
