"use strict";
// API Imports
const responses = require("../helpers/responses/responses.json");
const respond = require("../helpers/responses/respond");
const { ulid } = require("ulid");
const createItem = require("../helpers/functions/createItem");
const getItem = require("../helpers/functions/getItem");
const verifySignatureCF = require("../api/market/wallet/verifySignatureCF");


module.exports.webhook = async (event, context, callback) => {
	try {
		
		let plugId = event.path.plugId;
		let signaturePayload = event.body.data == undefined;
		let data = event.body;
		if (data["txStatus"] == "FAILED") {
			let wallet = await getItem({
				pk: "user#" + plugId,
				sk: "wallet#",
			});
			let transactionIdFail = ulid();
			let transactionItem = {
				pk: "user#" + plugId,
				sk: "wallet_transaction#" + transactionIdFail + "#deposit",
				amount: Number(data["orderAmount"]),
				type: "deposit",
				createdAt: Date.now(),
				transactionId: transactionIdFail,
				referenceId: data["referenceId"],
				orderId: data["orderId"],
				wallet_balance: wallet.data.balance,
				order_status: "FAILED",
			};

			await createItem(transactionItem, false);
			responses.custom.message = "Transaction failed";
			responses.custom.responseData = { txStatus: "FAILED" };
			respond(responses.custom, callback);
			return;
		}
		 else if (signaturePayload) {
			let postData = {
				api_type: "CF_VERIFY_SIGN",
				orderId: data["orderId"],
				orderAmount: data["orderAmount"],
				referenceId: data["referenceId"],
				txStatus: data["txStatus"],
				paymentMode: data["paymentMode"],
				txMsg: data["txMsg"],
				txTime: data["txTime"],
				signature: data["signature"],
				plugId: plugId,
			};
			await verifySignatureCF(postData, callback)
			responses.apiSuccess.responseData = {};
			respond(responses.apiSuccess, callback);
			return;
		}
		// if (!signaturePayload) {
		// 	let keysCf = Object.keys(event.body);
		// 	console.log(event)
		// 	var timestamp = event.headers["x-webhook-timestamp"];
		// 	var signature = event.headers["x-webhook-signature"];
		// 	keysCf.sort();
		// 	var signatureData = "";

		// 	keysCf.forEach((key) => {
		// 		if (key != "signature") {
		// 			signatureData += event.body[key];
		// 		}
		// 	});
		// 	signatureData = String(timestamp) + "." + signatureData;

		// 	var computedSignature = crypto
		// 		.createHmac("sha256", keys.cashFree["x-client-secret-debit"])
		// 		.update(signatureData)
		// 		.digest("base64");

		// 	if (computedSignature == signature) {
		// 		console.log(computedSignature, signature);
		// 		await createNotification(plugId, {
		// 			notify: true,
		// 			item_sk: "ss",
		// 			image:
		// 				"https://plug-main-media.s3.ap-south-1.amazonaws.com/tags/credit.png",
		// 			notification_type: "debit",
		// 			text: `Transaction Success to debit to your wallet balance.`,
		// 			title: "Transaction Success",
		// 			custom_info: {},
		// 			order_status: "FAILED",
		// 		});
		// 		return { verified: true, computedSignature };
		// 	}
		// 	console.log(computedSignature, signature);
		// 	await createNotification(plugId, {
		// 		notify: true,
		// 		item_sk: "ss",
		// 		image:
		// 			"https://plug-main-media.s3.ap-south-1.amazonaws.com/tags/credit.png",
		// 		notification_type: "debit",
		// 		text: `Transaction failed to debit to your wallet balance.`,
		// 		title: "Transaction Failed",
		// 		custom_info: {},
		// 		order_status: "FAILED",
		// 	});
		// 	return { verified: false, computedSignature };
		// }
	} catch (error) {
		console.log(error);
		return error;
	}
};
