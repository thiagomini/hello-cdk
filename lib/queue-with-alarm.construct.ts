import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";

export interface QueueWithAlarmProps {
  name?: string;
}

export class QueueWithAlarm extends Construct {
  constructor(scope: Construct, id: string, props: QueueWithAlarmProps) {
    super(scope, id);

    new sqs.Queue(this, "Queue", {
      queueName: props.name,
    });
  }
}
