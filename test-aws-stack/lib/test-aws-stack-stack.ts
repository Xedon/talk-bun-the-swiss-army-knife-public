import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import * as logs from "aws-cdk-lib/aws-logs";
import { resolve } from "path";
import widget from "../../dashboard.json";

export class TestAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcResource = new ec2.Vpc(this, "VPC", {
      subnetConfiguration: [
        { name: "public", subnetType: ec2.SubnetType.PUBLIC },
        { name: "private", subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    const imageDirectory = resolve(__dirname, "..", "..");

    const serviceCount = 1;

    const serviceSG = new ec2.SecurityGroup(this, "ServiceSG", {
      vpc: vpcResource,
      allowAllOutbound: true,
      allowAllIpv6Outbound: true,
    });

    serviceSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      "Allow inbound traffic on port 3000"
    );

    new ec2.SecurityGroup(this, "K6SG", {
      vpc: vpcResource,
      allowAllOutbound: true,
      allowAllIpv6Outbound: true,
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      containerInsights: true,
      enableFargateCapacityProviders: true,
      vpc: vpcResource,
    });

    cluster.addDefaultCapacityProviderStrategy([
      { capacityProvider: "FARGATE", weight: 1 },
    ]);

    const k6ExecutionRole = new iam.Role(this, "ecsTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "CloudWatchAgentServerPolicy"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        ),
      ],
    });

    const k6TaskDefinition = new ecs.FargateTaskDefinition(this, "K6Task", {
      cpu: 4096,
      memoryLimitMiB: cdk.Size.gibibytes(8).toMebibytes(),
      executionRole: k6ExecutionRole,
    });

    k6TaskDefinition.taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
    );

    const k6Container = k6TaskDefinition.addContainer("k6", {
      image: ecs.ContainerImage.fromAsset(imageDirectory, {
        file: "k6.dockerfile",
        ignoreMode: cdk.IgnoreMode.DOCKER,
      }),
      environment: {
        HOSTNAME: "CHANGEME",
        VUS: "500",
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: cluster.clusterName,
        logRetention: logs.RetentionDays.ONE_DAY,
      }),
    });

    k6Container.addUlimits({
      name: ecs.UlimitName.NOFILE,
      softLimit: 65536,
      hardLimit: 65536,
    });

    const ssmParameter = new ssm.StringParameter(this, "statsd-config", {
      parameterName: "ecs-cwagent-sidecar-fargate",
      stringValue: `{
        "metrics": {
            "namespace": "k6",
            "metrics_collected": {
                "statsd": {
                    "service_address": ":8125",
                    "metrics_collection_interval": 1,
                    "metrics_aggregation_interval": 0
                }
            }
        }
      }`,
    });

    k6TaskDefinition.addContainer("cloudwatch-agent", {
      image: ecs.ContainerImage.fromRegistry("amazon/cloudwatch-agent:latest"),
      secrets: {
        CW_CONFIG_CONTENT: ecs.Secret.fromSsmParameter(ssmParameter),
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: cluster.clusterName,
        logRetention: logs.RetentionDays.ONE_DAY,
      }),
    });

    const defaultServiceCpu = 2048;
    const defaultServiceMemory = cdk.Size.gibibytes(4).toMebibytes();

    const nodeJsTask = new ecs.FargateTaskDefinition(this, "NodeJs", {
      cpu: defaultServiceCpu,
      memoryLimitMiB: defaultServiceMemory,
    });

    nodeJsTask.addContainer("NodeJs", {
      image: ecs.ContainerImage.fromAsset(imageDirectory, {
        file: "nodejs.dockerfile",
        ignoreMode: cdk.IgnoreMode.DOCKER,
      }),
      portMappings: [{ containerPort: 3000, hostPort: 3000 }],
      logging: new ecs.AwsLogDriver({
        streamPrefix: "NodeJs",
        logRetention: logs.RetentionDays.ONE_DAY,
      }),
    });

    new ecs.FargateService(this, "NodeJsService", {
      cluster,
      taskDefinition: nodeJsTask,
      desiredCount: serviceCount,
      serviceName: "NodeJsService",
      securityGroups: [serviceSG],
      assignPublicIp: true,
    });

    const bunTask = new ecs.FargateTaskDefinition(this, "Bun", {
      cpu: defaultServiceCpu,
      memoryLimitMiB: defaultServiceMemory,
    });

    bunTask.addContainer("Bun", {
      image: ecs.ContainerImage.fromAsset(imageDirectory, {
        file: "bun.dockerfile",
        ignoreMode: cdk.IgnoreMode.DOCKER,
      }),
      portMappings: [{ containerPort: 3000, hostPort: 3000 }],
      logging: new ecs.AwsLogDriver({
        streamPrefix: "Bun",
        logRetention: logs.RetentionDays.ONE_DAY,
      }),
    });

    new ecs.FargateService(this, "BunService", {
      cluster,
      taskDefinition: bunTask,
      desiredCount: serviceCount,
      serviceName: "BunService",
      securityGroups: [serviceSG],
      assignPublicIp: true,
    });

    const bunSfTask = new ecs.FargateTaskDefinition(this, "BunSf", {
      cpu: defaultServiceCpu,
      memoryLimitMiB: defaultServiceMemory,
    });

    bunSfTask.addContainer("BunSf", {
      image: ecs.ContainerImage.fromAsset(imageDirectory, {
        file: "sf-bun.dockerfile",
        ignoreMode: cdk.IgnoreMode.DOCKER,
      }),
      portMappings: [{ containerPort: 3000, hostPort: 3000 }],
      logging: new ecs.AwsLogDriver({
        streamPrefix: "BunSf",
        logRetention: logs.RetentionDays.ONE_DAY,
      }),
    });

    new ecs.FargateService(this, "BunSfService", {
      cluster,
      taskDefinition: bunSfTask,
      desiredCount: serviceCount,
      serviceName: "BunSfService",
      securityGroups: [serviceSG],
      assignPublicIp: true,
    });

    new cw.CfnDashboard(this, "K6", {
      dashboardName: "K6",
      dashboardBody: JSON.stringify(widget),
    });
  }
}
