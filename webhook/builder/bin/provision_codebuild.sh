#!/bin/bash
source ../../env.sh

ENVIRONMENT="${APP_ENVIRONMENT}"
if [[ "$APP_ENVIRONMENT" = 'prod' || "$APP_ENVIRONMENT" = 'production' ]] ;
then
    ENVIRONMENT='prod'
else
    ENVIRONMENT='dev'
fi

aws cloudformation deploy \
  --template-file cloudformation/codebuild.yaml \
  --stack-name "local-debug-codebuild-${ENVIRONMENT}"  \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    AppEnvironment=${ENVIRONMENT} \
    GitRepository="${GIT_REPOSITORY}" \
  --profile "${1}"

