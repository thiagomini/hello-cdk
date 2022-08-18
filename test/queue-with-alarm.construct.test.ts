import * as cdk from "aws-cdk-lib";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { Match, Template } from "aws-cdk-lib/assertions";
import {
  QueueWithAlarm,
  QueueWithAlarmProps,
} from "../lib/queue-with-alarm.construct";
import { AwsResources } from "./aws.resources";
import { Duration } from "aws-cdk-lib";

describe("QueueWithAlarm", () => {
  it("should provide an SQS Queue with given name", () => {
    const sut = createSut({
      name: "QueueName",
    });

    sut.hasResourceProperties(AwsResources.SQS.Queue, {
      QueueName: "QueueName",
    });
  });

  it("should provide a CloudWatch Alarm with correct values when a threshold is provided", () => {
    const sut = createSut({
      messagesNotVisibleThreshold: 50,
    });

    sut.hasResourceProperties(AwsResources.CloudWatch.Alarm, {
      ComparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      Threshold: 50,
      EvaluationPeriods: Duration.minutes(1).toSeconds(),
    });
  });

  it("should provide a CloudWatch Alarm with correct values when no threshold is provided", () => {
    const sut = createSut();

    sut.hasResourceProperties(AwsResources.CloudWatch.Alarm, {
      ComparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      Threshold: Match.anyValue(),
      EvaluationPeriods: Duration.minutes(1).toSeconds(),
    });
  });
});

const createSut = (queueWithAlarmProps: QueueWithAlarmProps = {}): Template => {
  const stack = new cdk.Stack();
  new QueueWithAlarm(stack, "TestQueueConstruct", queueWithAlarmProps);

  return Template.fromStack(stack);
};
