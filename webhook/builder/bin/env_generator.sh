#!/bin/bash

export env=$(aws ssm get-parameter --name "BUILDSPEC_ENV" --with-decryption --query "Parameter.Value" --profile "${1}")
if [[ "$env" = 'prod' || "$env" = 'production' ]] ;
then
    aws --region=us-east-1 ssm get-parameters \
    --names "APP_ENVIRONMENT:production" "GIT_REPOSITORY:production" "PASSWORD:production"\
    --with-decryption \
    --output text 2>&1 \
    --query 'Parameters[*].{Name:Name,Value:Value}' \
    --profile "${1}" \
    | sed 's/.*----BEGIN/----BEGIN/' \
    | sed 's/KEY-----.*/KEY-----/' \
    | sed -e 's/\s\+/=/g' > ../../env.sh
else
    aws --region=us-east-1 ssm get-parameters \
    --names "APP_ENVIRONMENT:development" "GIT_REPOSITORY:development" "PASSWORD:development"\
    --with-decryption \
    --output text 2>&1 \
    --query 'Parameters[*].{Name:Name,Value:Value}' \
    --profile "${1}" \
    | sed 's/.*----BEGIN/----BEGIN/' \
    | sed 's/KEY-----.*/KEY-----/' \
    | sed -e 's/\s\+/=/g' > ../../env.sh
fi




