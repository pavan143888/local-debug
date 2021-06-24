import { EventProcessor } from "./EventProcessor";
import { APIGatewayRequest, APIGatewayResponse } from "./APIGateway";

exports.handler = async (event: APIGatewayRequest) => {
    try {
        console.log("Event" +JSON.stringify(event));
        const processor = new EventProcessor();
        const response: APIGatewayResponse = await processor.run(event);
        return Promise.resolve(response);
    } catch (err) {
        console.log("failed to run event processor: ", err);
        return Promise.resolve({ statusCode: 500 } as APIGatewayResponse);
    }
};
