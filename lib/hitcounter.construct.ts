import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface HitCounterProps {
  /** the function for which we want to count url hits **/
  downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
  public readonly counterFunctionHandler: lambda.Function;
  public readonly hitCounterTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    this.hitCounterTable = this.createDynamoDBTable();
    this.counterFunctionHandler = this.createHitCounterLambda(props);
    this.hitCounterTable.grantReadWriteData(this.counterFunctionHandler);
    props.downstream.grantInvoke(this.counterFunctionHandler);
  }

  private createDynamoDBTable(): dynamodb.Table {
    return new dynamodb.Table(this, "Hits", {
      partitionKey: { name: "path", type: dynamodb.AttributeType.STRING },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });
  }

  private createHitCounterLambda(props: HitCounterProps): lambda.Function {
    return new lambda.Function(this, "HitCounterHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "hitcounter.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        /*
          These env vars are called late-bound-balues. Check the link below for more information 
          https://cdkworkshop.com/20-typescript/40-hit-counter/300-resources.html#late-bound-values
        */
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.hitCounterTable.tableName,
      },
    });
  }
}
