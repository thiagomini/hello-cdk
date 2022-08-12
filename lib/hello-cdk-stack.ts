import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { aws_s3 as s3 } from "aws-cdk-lib";

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    this.buildQueue();
    this.buildS3Bucket();
  }

  private buildQueue(): void {
    new sqs.Queue(this, "HelloCdkQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
  }

  private buildS3Bucket(): void {
    new s3.Bucket(this, "MyFirstBucket", {
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
