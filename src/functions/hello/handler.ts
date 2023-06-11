import { formatJSONResponse } from '@libs/api-gateway';
import { Route53Client, ListResourceRecordSetsCommand, ListResourceRecordSetsCommandInput, ListResourceRecordSetsRequest, ListResourceRecordSetsResponse, ChangeResourceRecordSetsRequest, ChangeResourceRecordSetsCommand } from "@aws-sdk/client-route-53";


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
  region: 'ap-northeast-1',
//  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
//  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
}
const hosted_zone_id = process.env.HOSTED_ZONE_ID;
// const local_hosted_zone_id = 'DD04XMEUC9EW8IK';

// "/hostedzone/4H03NPQUW4QPA6V"

const ip_addresses = {
  first: "10.0.0.1",
  second: "10.0.0.2"
}


const record_set_request_input: ListResourceRecordSetsRequest = {
  HostedZoneId: hosted_zone_id,
  StartRecordName: 'a.henoheno-pro.com',
  StartRecordType: 'A',
  MaxItems: 1
}


const hello = async (event: EventBridge) => {
  console.log(CONFIG)
  
  const client = new Route53Client(CONFIG);
  const command = new ListResourceRecordSetsCommand(record_set_request_input);
  const list_response: ListResourceRecordSetsResponse = await client.send(command);
  const ip_address = switch_ip_address(list_response.ResourceRecordSets[0].ResourceRecords[0].Value);
  console.log({ip_address});
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
              Value: ip_address,
            }]
          }
        }
      ]
    }
  }
  console.log(list_response);
  const change_command = new ChangeResourceRecordSetsCommand(change_recordset_command);
  const change_response = await client.send(change_command);
  console.log(change_response);
  return formatJSONResponse({
    message: `Hello ${event.name}, welcome to the exciting Serverless world!`,
    event,
  });
};

const switch_ip_address = ((current: string): string => {
  console.log({current});
  if(current === ip_addresses.first) {
    return ip_addresses.second;
  }
  return ip_addresses.first;
})

export const main = hello;
