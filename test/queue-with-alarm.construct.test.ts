import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { QueueWithAlarm } from "../lib/queue-with-alarm.construct";
import { AwsResources } from "./aws.resources";

describe("QueueWithAlarm", () => {
  it("should provide an SQS Queue with given name", () => {
    const stack = new cdk.Stack();
    new QueueWithAlarm(stack, "TestQueueConstruct", {
      name: "QueueName",
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties(AwsResources.SQS.Queue, {
      QueueName: "QueueName",
    });
  });
});
