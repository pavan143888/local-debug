import { EventProcessor } from "./EventProcessor";
import { APIGatewayRequest } from "./APIGateway";
exports.handler = async (event: any) => {

    try {
        if (!event || !event.Records || !event.Records.length) {
            return Promise.resolve("received empty event");
        }

        if (event.Records.length !== 1) {
            return Promise.resolve(`unexpected number of records: ${event.records}`);
        }

        const record: GitHubEventRecord = event.Records[0];
        const body: GitHubEventRecordBody = JSON.parse(record.body);
        const processor = new EventProcessor();
        const response = await processor.run(body.APIGatewayRequest);
        return Promise.resolve();
    } catch (err) {
        console.log("failed to run event processor: ", err);
        return Promise.resolve();
    }
};

export interface GitHubEventRecord {
    // body is `GitHubEventRecordBody` JSON serialized.
    body: string; //
    messageAttributes?: {};
}

export interface GitHubEventRecordBody {
    APIGatewayRequest: APIGatewayRequest;
}
