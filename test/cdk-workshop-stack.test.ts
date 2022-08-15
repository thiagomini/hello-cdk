import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";
import { AwsResources } from "./aws.resources";
import { TableViewer } from "cdk-dynamo-table-viewer";
jest.mock("cdk-dynamo-table-viewer");

describe("CdkWorkshopStack", () => {
  it("should provide a Lambda Function", () => {
    const template = createSut();

    template.hasResourceProperties(AwsResources.Lambda.Function, {
      Handler: "hello.handler",
      Runtime: "nodejs16.x",
    });
  });

  it("should provide a REST API Gateway", () => {
    const template = createSut();

    template.resourceCountIs(AwsResources.ApiGateway.RestApi, 1);
  });

  it("should use a TableViewer", () => {
    const app = new cdk.App();
    new CdkWorkshopStack(app, "MyTestStack");

    expect(TableViewer).toHaveBeenCalled();
  });
});

const createSut = (): Template => {
  const app = new cdk.App();
  const stack = new CdkWorkshopStack(app, "MyTestStack");
  return Template.fromStack(stack);
};
