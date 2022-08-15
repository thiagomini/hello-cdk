import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";
import { AwsResources } from "./aws.resources";
describe("CdkWorkshopStack", () => {
  it("should provide a Lambda Function", () => {
    const template = createSut();

    template.hasResourceProperties(AwsResources.Lambda.Function, {
      Handler: "hello.handler",
      Runtime: "nodejs16.x",
    });
  });
});

const createSut = (): Template => {
  const app = new cdk.App();
  const stack = new CdkWorkshopStack(app, "MyTestStack");
  return Template.fromStack(stack);
};
