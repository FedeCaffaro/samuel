#!/bin/bash

ext=png
CID_VERSION=1
PINATA_JWT=
PINATA_GATEWAY=
START_TOKEN=1
END_TOKEN=20

# Copy images folder to IPFS
ipfs add --recursive --wrap-with-directory ./files/images/ > ipfs-images.tmp
IMAGE_CID=$(tail -n 1 ipfs-images.tmp | cut -d' ' -f2)
IMAGE_URI="https://$PINATA_GATEWAY/ipfs/$IMAGE_CID/images"

# Update the image metadata and copy to IPFS
for i in $(eval echo "{$START_TOKEN..$END_TOKEN}")
do
   URL=$IMAGE_URI jq ".image = \"$IMAGE_URI/$i.$ext\"" ./files/metadata/$i > ./tmp/$i.tmp
   mv ./tmp/$i.tmp ./files/metadata/$i
done
ipfs add --recursive --wrap-with-directory ./files/metadata/ > ipfs-meta.tmp
META_CID=$(tail -n 1 ipfs-meta.tmp | cut -d' ' -f2)
META_URI="https://$PINATA_GATEWAY/ipfs/$META_CID/metadata/"
echo "Finished copying all images and metadata."

# Copy collection image to IPFS
ipfs add ./files/collection/collection.$ext > ipfs-collection.tmp
COLLECTION_CID=$(tail -n 1 ipfs-collection.tmp | cut -d' ' -f2)
COLLECTION_URI="https://$PINATA_GATEWAY/ipfs/$COLLECTION_CID"

# Update collection metadata and copy to IPFS
URL=$COLLECTION_URI jq ".image = \"$COLLECTION_URI\"" ./files/collection/contract > ./tmp/contract.tmp
mv ./tmp/contract.tmp ./files/collection/contract
ipfs add ./files/collection/contract > ipfs-contract.tmp
CONTRACT_CID=$(tail -n 1 ipfs-contract.tmp | cut -d' ' -f2)
CONTRACT_URI="https://$PINATA_GATEWAY/ipfs/$CONTRACT_CID"
echo "Finished copying collection metadata."

# Pin everything
ipfs pin remote service add pinata https://api.pinata.cloud/psa $PINATA_JWT
ipfs pin remote add --background --service=pinata --name=metadata "${META_CID}"
ipfs pin remote add --background --service=pinata --name=images "${IMAGE_CID}"
ipfs pin remote add --background --service=pinata --name=collection "${COLLECTION_CID}"
ipfs pin remote add --background --service=pinata --name=contract "${CONTRACT_CID}"

echo "---------------------------------------------------------------"
echo "Base Token URI: $META_URI"
echo "Contract URI: $CONTRACT_URI"
echo "---------------------------------------------------------------"





