"use strict";

const AWS = require("aws-sdk");
require("dotenv").config();
const keys = require("../../configs/keys.json");

const s3 = new AWS.S3({
	accessKeyId: keys["iam-keys"].public,
	secretAccessKey: keys["iam-keys"].secret,
	Bucket: "plug-main-media",
	region: "ap-south-1"
});

module.exports = async (imageData, imagePathWithName, type) => {
	let fileParams = {};

	if (type != "mp4") {
		let imageBuffer = Buffer.from(
			imageData.replace(/^data:image\/\w+;base64,/, ""),
			"base64"
		);

		fileParams = {
			Bucket: "plug-main-media",
			Key: imagePathWithName,
			Body: imageBuffer,
			ACL: "public-read",
			ContentEncoding: "base64",
			ContentType: `image/${type}`,
		};
	}
	try {
		await s3.upload(fileParams).promise();
		return { status: true };
	} catch (error) {
		return { status: false, error: error };
	}
};
