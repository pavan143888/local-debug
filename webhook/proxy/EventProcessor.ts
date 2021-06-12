import * as _AWS from "aws-sdk";
import { APIGatewayRequest, APIGatewayResponse } from "./APIGateway";

const AWSXRay = require("aws-xray-sdk");
const AWS = AWSXRay.captureAWS(_AWS);

export class EventProcessor {
    async run(req: APIGatewayRequest): Promise<APIGatewayResponse> {
        const partialRequest: APIGatewayRequest = { ...req };
        const body = JSON.parse(req.body);
        const responseOK: APIGatewayResponse = { statusCode: 200 };
        partialRequest.body = JSON.stringify(body);
        const params = {
            QueueUrl: process.env.QueueURL,
            MessageBody: JSON.stringify({
                APIGatewayRequest: partialRequest,
            } as GitHubEventRecordBody)
        };
        const sqs = new AWS.SQS({ region: "us-east-1" });
        console.log("Sending sqs message")
        await sqs.sendMessage(params).promise();
        return Promise.resolve(responseOK);
    }
}

export interface GitHubEventRecordBody {
    APIGatewayRequest: APIGatewayRequest;
}
