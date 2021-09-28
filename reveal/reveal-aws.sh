#!/bin/bash

export AWS_ACCESS_KEY_ID=AKIAVBH3H7X3LETBS4D7
export AWS_SECRET_ACCESS_KEY=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
export AWS_REGION=us-east-1

ext=png
BASE_URI=https://samotnft-assets-prod.s3.amazonaws.com
START_TOKEN=1
END_TOKEN=10

mkdir tmp

# Update the image metadata
for i in $(eval echo "{$START_TOKEN..$END_TOKEN}")
do
   URL=$BASE_URI jq ".image = \"$BASE_URI/images/$i.$ext\"" ./files/metadata/$i > ./tmp/$i.tmp
   mv ./tmp/$i.tmp ./files/metadata/$i
done

# Update the contract metadata and copy to S3
URL=$BASE_URI jq ".image = \"$BASE_URI/collection/collection.$ext\"" ./files/collection/contract > ./tmp/contract.tmp
mv ./tmp/contract.tmp ./files/collection/contract

# Copy to S3
aws s3 sync ./files/collection s3://samotnft-assets-prod/collection/ --delete
aws s3 sync ./files/metadata s3://samotnft-source-prod/metadata/ --delete
aws s3 sync ./files/images s3://samotnft-source-prod/images/ --delete

echo "---------------------------------------------------------------"
echo "Base Token URI: $BASE_URI/metadata/"
echo "Contract URI: $BASE_URI/contract"
echo "---------------------------------------------------------------"





