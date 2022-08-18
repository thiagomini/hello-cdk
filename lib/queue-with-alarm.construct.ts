import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { Duration } from "aws-cdk-lib";

export interface QueueWithAlarmProps {
  name?: string;

  /**
   * @default 100
   */
  messagesNotVisibleThreshold?: number;
}

export class QueueWithAlarm extends Construct {
  constructor(scope: Construct, id: string, props: QueueWithAlarmProps) {
    super(scope, id);

    const queue = new sqs.Queue(this, "Queue", {
      queueName: props.name,
    });

    const metric = queue.metricApproximateNumberOfMessagesNotVisible({
      label: "Messages Visible (Approx)",
      period: Duration.minutes(5),
    });

    metric.createAlarm(this, "TooManyMessagesAlarm", {
      comparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: props.messagesNotVisibleThreshold ?? 100,
      evaluationPeriods: Duration.minutes(1).toSeconds(),
    });
  }
}
