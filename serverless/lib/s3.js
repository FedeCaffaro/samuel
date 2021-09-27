let AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3()

const storage = {
  getObject: async (key, bucket) => {
    const params = { Bucket: bucket, Key: key }
    return s3.getObject(params).promise()
  },
  putObject: async (key, bucket, body) => {
    const params = { Bucket: bucket, Key: key, Body: body }
    return s3.putObject(params).promise()
  },
}

module.exports = storage