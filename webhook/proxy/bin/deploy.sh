#!/bin/bash
source ../../env.sh
aws cloudformation package \
  --template-file cloudformation/template.yaml \
  --s3-bucket "local-debug-${APP_ENVIRONMENT}-bucket" \
  --output-template-file cloudformation/template-packaged.yaml \
  --profile "${1}"

aws cloudformation deploy \
  --template-file cloudformation/template-packaged.yaml \
  --stack-name "local-debug-webhook-proxy-${APP_ENVIRONMENT}-deploy" \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    AppEnvironment="${APP_ENVIRONMENT}" \
  --profile "${1}"
