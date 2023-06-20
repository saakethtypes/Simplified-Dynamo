const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
module.exports = async (key,attr,num) => {
	

	let expressionStatement = `SET `
	let expValues = {}
	for (let i = 0; i < attr.length; i++) {
		let attr_name = attr[i]['name']
		let attr_value = attr[i]['value']
		expValues[":"+attr_name] = attr_value
		expressionStatement += `${attr_name} = ${attr_name} + :${attr_name}, `
	}
	expressionStatement = String(expressionStatement).slice(0, expressionStatement.lastIndexOf(","))
    const params = {
        TableName: keys.prod.tableName,
        Key: {
          pk: key.pk,
          sk: key.sk,
        },
        ExpressionAttributeValues: expValues,
        UpdateExpression: expressionStatement,
        ReturnValues: "ALL_NEW",
      };
  try {
    let success = await db.update(params).promise().then((data) => {
        if (data) {
          return { status: true, data: data , exists:true };
        } 
      })  
    return { status: true, data: success , exists:true};
  } catch (error) {
    return { status: false, error: error , exists:false };
  }
};
