-include .env

LOAD_TEST=docker run --network=host --rm -i -e K6_CLOUD_TOKEN=${K6_CLOUD_TOKEN} -e PORT=${PORT} grafana/k6 run --out cloud --vus 10 --duration 30s - <loadTest.js

loadtest-nodejs: PORT=3001
loadtest-nodejs:
	${LOAD_TEST}

loadtest-bun: PORT=3000
loadtest-bun:
	${LOAD_TEST}

loadtest-sf-bun: PORT=3002
loadtest-sf-bun:
	${LOAD_TEST}

CLUSTER_NAME=talk-bun-the-swiss-army-knife-ClusterEB0386A7-Wt6Qu6OFgGjP
IP_QUERY=TASK_ARN=$$(aws ecs list-tasks --cluster "${CLUSTER_NAME}" --service-name "${SERVICE_NAME}" --query 'taskArns[0]' --output text) &&\
	TASK_DETAILS=$$(aws ecs describe-tasks --cluster "${CLUSTER_NAME}" --task "$${TASK_ARN}" --query 'tasks[0].attachments[0].details')&&\
	ENI=$$(echo $$TASK_DETAILS | jq -r '.[] | select(.name=="networkInterfaceId").value')&&\
	IP=$$(aws ec2 describe-network-interfaces --network-interface-ids "$${ENI}" --query 'NetworkInterfaces[0].Association.PublicIp' --output text)&&\
	echo "${SERVICE_NAME}: $$IP"

nodejs-ip: SERVICE_NAME=NodeJsService
nodejs-ip:
	${IP_QUERY}

bun-ip: SERVICE_NAME=BunService
bun-ip:
	${IP_QUERY}

bunsf-ip: SERVICE_NAME=BunSfService
bunsf-ip:
	${IP_QUERY}

service-ips: nodejs-ip bun-ip bunsf-ip

boostrap:
	cd test-aws-stack && aws-vault exec ${AWS_VAULT_PROFILE} -- bun run cdk bootstrap --qualifier ev

deploy:
	cd test-aws-stack && aws-vault exec ${AWS_VAULT_PROFILE} bun run cdk deploy

destroy:
	cd test-aws-stack && aws-vault exec ${AWS_VAULT_PROFILE} bun run cdk destroy


publish:
	cp -R . /tmp/publishing &&\
	cd /tmp/publishing &&\
	rm -rf /tmp/publishing/slideAssets &&\
	rm -rf .git &&\
	git init &&\
	git add . &&\
	git commit -m "Publish for the world" &&\
	git remote add origin git@github.com:Xedon/talk-bun-the-swiss-army-knife-public.git &&\
	git branch -M main &&\
	git push -fu origin main &&\
	rm -rf /tmp/publishing

build-images:
	docker build . -f nodejs-bundle.dockerfile -t nestjs:nodejs-bundle
	docker build . -f nodejs.dockerfile -t nestjs:nodejs
	docker build . -f bun.dockerfile -t nestjs:bun
	docker build . -f bun-bundle.dockerfile -t nestjs:bun-bundle
	docker build . -f sf-bun.dockerfile -t nestjs:sf-bun 