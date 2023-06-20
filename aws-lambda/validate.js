"use strict";
require("dotenv").config();
const jwt = require("jsonwebtoken");
const keys = require("../configs/keys.json");

module.exports.validate = async (event, context, callback) => {
	const authorizerToken = event.authorizationToken;
	const token = authorizerToken;
	try {
		let username = await jwt.verify(token, keys.jwt.secret_access);
		console.log(username);
		if (typeof username !== "undefined") {
			let endpoint = event.methodArn.split("/");
			endpoint = endpoint[endpoint.length - 1];
			if (endpoint != "admin" || endpoint != "curator") {
				return generatePolicy(username.username, "Allow", event.methodArn);
			}

			if (username.isCurator) {
				return generatePolicy(username.username, "Allow", event.methodArn);
			} else if (username.isAdmin) {
				return generatePolicy(username.username, "Allow", event.methodArn);
			} else {
				generatePolicy(username.username, "Deny", event.methodArn);
				await callback("Unauthorized");
				return {
					statusCode: 419,
					body: "Denied",
				};
			}
		} else {
			generatePolicy(username.username, "Deny", event.methodArn);
			return;
		}
	} catch (e) {
		await callback("Unauthorized");
		return {
			statusCode: 419,
			body: "Denied",
		};
	}
};

// Help function to generate an IAM policy
const generatePolicy = function (principalId, effect, resource) {
	let authResponse = {};
	authResponse.principalId = principalId;
	if (effect && resource) {
		let policyDocument = {};
		policyDocument.Version = "2012-10-17";
		policyDocument.Statement = [];
		let statementOne = {};
		statementOne.Action = "execute-api:Invoke";
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}
	console.log(authResponse.policyDocument.Statement[0]);
	return authResponse;
};
