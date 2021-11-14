#!/bin/bash

export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_REGION=

ext=png
COLLECTION=samotclub
BASE_URI=https://assets.samot.club/$COLLECTION
START_TOKEN=1
END_TOKEN=8888

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
aws s3 sync ./files/collection s3://samotclub-assets-prod/$COLLECTION/collection/ --delete
aws s3 sync ./files/metadata s3://samotclub-source-prod/$COLLECTION/metadata/ --delete
aws s3 sync ./files/images s3://samotclub-source-prod/$COLLECTION/images/ --delete

echo "---------------------------------------------------------------"
echo "Base Token URI: https://api.samot.club/token/$COLLECTION/"
echo "Contract URI: https://api.samot.club/contract/$COLLECTION"
echo "---------------------------------------------------------------"





