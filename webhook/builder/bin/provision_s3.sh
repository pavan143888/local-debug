#!/bin/bash
source ../../env.sh
aws cloudformation deploy \
  --template-file cloudformation/lambda-s3.yaml \
  --stack-name "local-debug-${APP_ENVIRONMENT}-bucket-provision"  \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    AppEnvironment="${APP_ENVIRONMENT}" \
  --profile "${1}"
