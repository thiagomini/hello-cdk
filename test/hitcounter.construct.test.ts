import * as cdk from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter.construct";
import { AwsResources } from "./aws.resources";

describe("HitCounterConstruct", () => {
  it("should provide a DynamoDB Table with Encryption", () => {
    const hitCounter = createSut();

    hitCounter.hasResourceProperties(AwsResources.DynamoDB.Table, {
      SSESpecification: {
        SSEEnabled: true,
      },
    });
  });

  it("should provide IAM permissions to update and create rows in DynamoDB table", () => {
    const hitCounter = createSut();

    const dynamodbActionsCapture = new Capture();
    hitCounter.hasResourceProperties(AwsResources.IAM.Policy, {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Allow",
            Action: dynamodbActionsCapture,
          }),
        ]),
      },
    });

    expect(dynamodbActionsCapture.asArray()).toContain("dynamodb:PutItem");
    expect(dynamodbActionsCapture.asArray()).toContain("dynamodb:UpdateItem");
  });

  it("should provide IAM permissions to call inner lambda function", () => {
    const hitCounter = createSut();

    hitCounter.hasResourceProperties(AwsResources.IAM.Policy, {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Allow",
            Action: "lambda:InvokeFunction",
          }),
        ]),
      },
    });
  });

  it("should provide a Lambda Function with correct ENV VARS", () => {
    const hitCounter = createSut();
    const envCapture = new Capture();

    hitCounter.hasResourceProperties(AwsResources.Lambda.Function, {
      Environment: envCapture,
    });

    expect(envCapture.asObject()).toEqual({
      Variables: {
        DOWNSTREAM_FUNCTION_NAME: {
          Ref: "StubLambda8970B28C",
        },
        HITS_TABLE_NAME: {
          Ref: "TestConstructHits080F8C75",
        },
      },
    });
  });
});

const createSut = (): Template => {
  const stack = new cdk.Stack();

  const lambdaStub = new lambda.Function(stack, "StubLambda", {
    code: lambda.Code.fromAsset("lambda"),
    runtime: lambda.Runtime.NODEJS_16_X,
    handler: "hello.handler",
  });

  new HitCounter(stack, "TestConstruct", {
    downstream: lambdaStub,
  });

  return Template.fromStack(stack);
};
