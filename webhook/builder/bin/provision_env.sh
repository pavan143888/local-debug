#!/bin/bash
source ../../env.sh

ENV=development
aws ssm put-parameter --name APP_ENVIRONMENT --type String \
    --value ${APP_ENVIRONMENT} --overwrite --profile "${1}" 
aws ssm put-parameter --name GIT_REPOSITORY --type SecureString \
    --value ${GIT_REPOSITORY} --overwrite --profile "${1}"
aws ssm put-parameter --name PASSWORD --type SecureString \
    --value ${PASSWORD} --overwrite --profile "${1}"


if [[ "$APP_ENVIRONMENT" == prod || "$APP_ENVIRONMENT" == production ]] ;
then
    ENV=production
fi
    aws ssm label-parameter-version --name APP_ENVIRONMENT --labels $ENV
    aws ssm label-parameter-version --name GIT_REPOSITORY --labels $ENV
    aws ssm label-parameter-version --name PASSWORD --labels $ENV
