import { formatJSONResponse } from '@libs/api-gateway';
import { Route53Client, ListResourceRecordSetsCommand, ListResourceRecordSetsRequest, ListResourceRecordSetsResponse, ChangeResourceRecordSetsRequest, ChangeResourceRecordSetsCommand } from "@aws-sdk/client-route-53";


type EventBridge = {
  name: { type: 'string' },
  account: { type: 'string' },
  region: { type: 'string' },
  detail: {},
  "detail-type": { type: 'string' },
  source: { type: 'string' },
  time: { type: 'string' },
  id: { type: 'string' },
  resources: { type: "object" }
}

const CONFIG = {
  region: 'api-northeast-1'
}
const hosted_zone_id = 'Z04289661GOO5YGQ4VK7H';

// "/hostedzone/4H03NPQUW4QPA6V"
const record_set_request_command: ListResourceRecordSetsRequest = {
  HostedZoneId: hosted_zone_id,
  StartRecordType: 'A'
}

const change_recordset_command: ChangeResourceRecordSetsRequest = {
  HostedZoneId: hosted_zone_id,
  ChangeBatch: {
    Comment: "change",
    Changes: [
      {
        Action: "UPSERT",
        ResourceRecordSet: {
          Name: "a.henoheno-pro.com",
          Type: "A",
          TTL: 100,
          ResourceRecords: [{
            Value: '5.5.5.5'
          }]
        }
      }
    ]
  }
}

const hello = async (event: EventBridge) => {
  console.log(event)

  const client = new Route53Client(CONFIG);
//  const command = new ListResourceRecordSetsCommand(record_set_request_command);
//  const response: ListResourceRecordSetsResponse = await client.send(command);
  const change_command = new ChangeResourceRecordSetsCommand(change_recordset_command);
  const response = await client.send(change_command);
  console.log(response);
  return formatJSONResponse({
    message: `Hello ${event.name}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = hello;
