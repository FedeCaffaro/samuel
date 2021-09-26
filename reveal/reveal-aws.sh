#!/bin/bash

export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_REGION=

ext=png
BASE_URI=https://assets.samotnftapi.com
START_TOKEN=11
END_TOKEN=20

mkdir tmp

# Update the image metadata
for i in $(eval echo "{$START_TOKEN..$END_TOKEN}")
do
   mv ./files/metadata/$i.json ./files/metadata/$i
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





