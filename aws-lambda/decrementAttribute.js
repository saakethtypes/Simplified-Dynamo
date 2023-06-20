const getClient = require('../../gateway/dbClient')
const db = getClient()
require('dotenv').config()
const keys = require('../../configs/keys.json')

module.exports = async (key, attr) => {
    const params = {
        TableName: keys.prod.tableName,
        Key: {
            pk: key.pk,
            sk: key.sk,
        },
        ExpressionAttributeValues: {
            ':updatedAt': Date.now(),
            ':inc': 1,
        },
        UpdateExpression: `SET ${attr} = ${attr} - :inc, updatedAt = :updatedAt`,
        ReturnValues: 'ALL_NEW',
    }
    try {
        let success = await db
            .update(params)
            .promise()
            .then((error) => {
                if (error) {
                    return { status: false, error: error, exists: false }
                }
            })

        return { status: true, data: success, exists: true }
    } catch (error) {
        return { status: false, error: error, exists: false }
    }
}
