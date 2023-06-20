"use strict";
require("dotenv").config();
const AWS = require("aws-sdk");
require("dotenv").config();
const keys = require("../../configs/keys.json");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_PUBLIC,
  secretAccessKey: process.env.S3_SECRET,
  Bucket: keys[process.env.ENVIRONMENT].S3BucketConfig.bucket,
  region: keys[process.env.ENVIRONMENT].S3BucketConfig.region,
});

module.exports = async (bucketPathWithFilename) => {
  var params = {
    Bucket: keys[process.env.ENVIRONMENT].S3BucketConfig.bucket,
    Key: bucketPathWithFilename,
  };
  try {
    await s3.deleteObject(params).promise();
    return { status: true };
  } catch (error) {
    return { status: false, error: error };
  }
};
