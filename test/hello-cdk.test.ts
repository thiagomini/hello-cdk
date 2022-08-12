import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as HelloCdk from "../lib/hello-cdk-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/hello-cdk-stack.ts
test("SQS Queue Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new HelloCdk.HelloCdkStack(app, "MyTestStack");
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::SQS::Queue", {
    VisibilityTimeout: 300,
  });
});

test("S3 Bucket Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new HelloCdk.HelloCdkStack(app, "MyTestStack");
  // THEN
  const template = Template.fromStack(stack);

  template.hasResource("AWS::S3::Bucket", {
    DeletionPolicy: "Delete",
    UpdateReplacePolicy: "Delete",
    Properties: {
      VersioningConfiguration: {
        Status: "Enabled",
      },
    },
  });
});
