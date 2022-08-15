import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter.construct";
import { AwsResources } from "./aws.resources";

describe("HitCounterConstruct", () => {
  it("should provide a DynamoDB Table", () => {
    const hitCounter = createSut();

    hitCounter.resourceCountIs(AwsResources.DynamoDB.Table, 1);
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
