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

    const queue = this.createQueueWithName(props.name);
    this.createAlarmForQueue(queue, props.messagesNotVisibleThreshold);
  }

  private createQueueWithName(name?: string) {
    return new sqs.Queue(this, "Queue", {
      queueName: name,
    });
  }

  private createAlarmForQueue(
    queue: sqs.Queue,
    messagesNotVisibleThreshold?: number
  ): void {
    const metric = this.createMetricForQueue(queue);

    metric.createAlarm(this, "TooManyMessagesAlarm", {
      comparisonOperator: cw.ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: messagesNotVisibleThreshold ?? 100,
      evaluationPeriods: Duration.minutes(1).toSeconds(),
    });
  }

  private createMetricForQueue(queue: sqs.Queue): cw.Metric {
    return queue.metricApproximateNumberOfMessagesNotVisible({
      label: "Messages Visible (Approx)",
      period: Duration.minutes(5),
    });
  }
}
