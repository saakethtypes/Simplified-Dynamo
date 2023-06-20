const getClient = require("../../gateway/dbClient");
const db = getClient();
require("dotenv").config();
const keys = require("../../configs/keys.json");
const createItem = require("./createItem");


module.exports = async (key,attr) => {
    const params = {
        TableName: keys.prod.tableName,
        Key: {
          pk: key.pk,
          sk: key.sk,
        },
        ExpressionAttributeValues: {
          //":updatedAt": Date.now(),
          ":inc": 1,
        },
        UpdateExpression:
          `SET ${attr} = ${attr} + :inc`,//, updatedAt = :updatedAt
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
	  if(key.createNew){
		  delete key['createNew']
		  await createItem(key)
		  return { status: true, data: {} , exists:true};
	  }
    return { status: false, error: error , exists:false };
  }
};
