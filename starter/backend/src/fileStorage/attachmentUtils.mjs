import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk-core'

// Wrap the v2 SDK with X-Ray for tracing
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

const bucket = process.env.ATTACHMENTS_S3_BUCKET
const expires = Number(process.env.SIGNED_URL_EXPIRATION || 300)

export const getUploadUrl = (key) =>
  s3.getSignedUrlPromise('putObject', {
    Bucket: bucket,
    Key: key,
    Expires: expires
  })

export const attachmentUrlFor = (key) =>
  `https://${bucket}.s3.amazonaws.com/${key}`
