var AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
exports.handler = async (event) => {

   

    let method = (((event || {}).requestContext || {}).http || {}).method || "";

    if (method != "POST") {
        return {
            statusCode: 200,
            body: {estado:401,message: "Solo se acepta request POST",data:null}
        };
    }



        let bodyReq = {};
       let body = (event || {}).body || "{}";
        try {
            bodyReq = JSON.parse(body);
        }
        catch (e) {
            return {
            statusCode: 200,
            body: {estado:401,message: "Error en body request",data:null}
        };
        }
    



    var params = {
        TableName: "vehiculos",
        Item: bodyReq
    };

    const data = await ddb.put(params).promise();


    //fin



    // TODO implement
    const response = {
        statusCode: 200,
        body: {estado:200,message: "success",data:data}  ,
        // body: "{\"data\":\"" + JSON.stringify(data) + "\"}",
    };
    return response;
};
