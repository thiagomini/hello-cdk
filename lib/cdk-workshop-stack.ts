import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaHandler = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"), // Code loaded from "lambda" directory
      handler: "hello.handler", // File is "hello" and function is "handler"
    });

    new apigw.LambdaRestApi(this, "Endpoint", {
      handler: lambdaHandler,
    });
  }
}
