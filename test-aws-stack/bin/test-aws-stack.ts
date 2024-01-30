#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TestAwsStack } from "../lib/test-aws-stack-stack";

const app = new cdk.App();
new TestAwsStack(app, "talk-bun-the-swiss-army-knife", {
  synthesizer: new cdk.DefaultStackSynthesizer({
    qualifier: "ev",
  }),
});
