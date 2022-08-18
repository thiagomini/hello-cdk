import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {
  QueueWithAlarm,
  QueueWithAlarmProps,
} from "../lib/queue-with-alarm.construct";
import { AwsResources } from "./aws.resources";

describe("QueueWithAlarm", () => {
  it("should provide an SQS Queue with given name", () => {
    const sut = createSut({
      name: "QueueName",
    });

    sut.hasResourceProperties(AwsResources.SQS.Queue, {
      QueueName: "QueueName",
    });
  });
});

const createSut = (queueWithAlarmProps: QueueWithAlarmProps = {}): Template => {
  const stack = new cdk.Stack();
  new QueueWithAlarm(stack, "TestQueueConstruct", queueWithAlarmProps);

  return Template.fromStack(stack);
};
