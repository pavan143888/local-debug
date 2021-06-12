import {APIGatewayRequest} from "./APIGateway";
import {CodeBuilder} from "./build/CodeBuilder";

export class EventProcessor {
    async run(req: APIGatewayRequest): Promise<any> {
        const obj = JSON.parse(req.body);
        const codeBuilder = new CodeBuilder();
        await codeBuilder.build(obj);
        const responseOK: any = {statusCode: 200};
        return Promise.resolve(responseOK);
    }
}

