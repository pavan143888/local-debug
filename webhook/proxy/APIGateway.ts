export interface APIGatewayRequest {
  headers: { [key: string]: string };
  body: string;
}

export interface APIGatewayResponse {
  statusCode: number;
}
