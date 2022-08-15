import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { HitCounter } from "./hitcounter.construct";
import { TableViewer } from "cdk-dynamo-table-viewer";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = this.buildHelloLambda();
    const helloWithCounter = this.wrapLambdaInHitCounter(helloLambda);
    this.buildApiGatewayFor(helloWithCounter);
    this.attachTableViewerTo(helloWithCounter.hitCounterTable);
  }

  private buildHelloLambda(): lambda.Function {
    return new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"), // Code loaded from "lambda" directory
      handler: "hello.handler", // File is "hello" and function is "handler"
    });
  }

  private wrapLambdaInHitCounter(lambda: lambda.Function): HitCounter {
    return new HitCounter(this, "HelloHitCounter", {
      downstream: lambda,
    });
  }

  private buildApiGatewayFor(hitCounter: HitCounter): void {
    new apigw.LambdaRestApi(this, "Endpoint", {
      handler: hitCounter.counterFunctionHandler,
    });
  }

  private attachTableViewerTo(dynamodbTable: dynamodb.Table): void {
    new TableViewer(this, "ViewHitCounter", {
      title: "Hello Hits",
      table: dynamodbTable,
    });
  }
}
