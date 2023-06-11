import type { AWS } from '@serverless/typescript';
import  hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'event-bridge',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-localstack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-northeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: [
        "route53:ChangeResourceRecordSets",
        "route53:ListHostedZones",
        "route53:ListResourceRecordSets",
      ],
      Resource: [
        "*"
      ]
    }],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      HOSTED_ZONE_ID: process.env.HOSTED_ZONE_ID
    },
  },
  // import the function via paths
  functions: { 
    hello: {
      handler: hello.handler,
      events: [{
        eventBridge: {
          schedule: "cron(0/20 * * * ? *)",
        }
      }]
    }
  },
  package: { individually: true },
  custom: {

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    localstack: {
      stages: 'local',
      host: 'http://localhost',
      edgePort: 4566,
      environment: {
        AWS_ACCESS_KEY_ID: "hogehoge",
        AWS_SECRET_ACCESS_KEY: "hogehoge",
      },
      lambda: {
        mountCode: true,
        input: {
          key1: 'value' 
        },
        iam: {
          role: {
            statements: {
              Effect: 'Allow',
              Action: [
                "route53:ChangeResourceRecordSets",
                "route53:ListHostedZones"
              ],
              Resource: [
                "*"
              ]
            }
          }
        }
      },
    } 
  },
};

module.exports = serverlessConfiguration;
