let AWS = require("aws-sdk");
const lambda = new AWS.Lambda({ region: "ap-south-1" });
module.exports = async (data) => {
  let params = {
    FunctionName: `plug-app-${process.env.ENVIRONMENT}-${data.functionType}`,
    Payload: JSON.stringify({
      body: data.body,
    }),
    InvocationType: "RequestResponse",
  };

  try {
    let dataReturned = await lambda.invoke(params, function async(err, data) {
      if (err) {
        return { status: false, error: err, exists: false };
      }
      return data.Payload;
    });

    return { status: true, data: dataReturned, exists: true };
  } catch (error) {
    return { status: false, error: error, exists: false };
  }
};
