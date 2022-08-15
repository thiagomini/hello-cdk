import * as cdk from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter.construct";
import { AwsResources } from "./aws.resources";

describe("HitCounterConstruct", () => {
  it("should provide a DynamoDB Table", () => {
    const hitCounter = createSut();

    hitCounter.resourceCountIs(AwsResources.DynamoDB.Table, 1);
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
  const construct = new HitCounter(stack, "TestConstruct", {
    downstream: lambdaStub,
  });

  return Template.fromStack(stack);
};
