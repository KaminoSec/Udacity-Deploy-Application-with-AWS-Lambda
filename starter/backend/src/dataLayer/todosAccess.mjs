// ESM + CommonJS interop: import default, then read captureAWS
import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk-core'

// Wrap v2 SDK with X-Ray (produces a namespaced AWS with tracing)
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
  constructor() {
    this.docClient = new XAWS.DynamoDB.DocumentClient()
    this.s3 = new XAWS.S3({ signatureVersion: 'v4' })

    this.todosTable = process.env.TODOS_TABLE
    this.indexName = process.env.TODOS_CREATED_AT_INDEX
    this.bucketName = process.env.ATTACHMENTS_S3_BUCKET
    this.urlExpiration = parseInt(
      process.env.SIGNED_URL_EXPIRATION || '300',
      10
    )
  }

  async getTodosForUser(userId) {
    const res = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: { ':uid': userId },
        ScanIndexForward: false
      })
      .promise()
    return res.Items || []
  }

  async createTodoItem(item) {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: item
      })
      .promise()
  }

  async updateTodoItem(userId, todoId, updated) {
    const sets = []
    const names = {}
    const values = {}

    if (updated.name !== undefined) {
      names['#n'] = 'name'
      values[':n'] = updated.name
      sets.push('#n = :n')
    }
    if (updated.dueDate !== undefined) {
      names['#d'] = 'dueDate'
      values[':d'] = updated.dueDate
      sets.push('#d = :d')
    }
    if (updated.done !== undefined) {
      names['#dn'] = 'done'
      values[':dn'] = updated.done
      sets.push('#dn = :dn')
    }

    if (sets.length === 0) return

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set ' + sets.join(', '),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values
      })
      .promise()
  }

  async deleteTodoItem(userId, todoId) {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
      .promise()
  }

  async updateAttachmentUrl(userId, todoId, attachmentUrl) {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl = :a',
        ExpressionAttributeValues: { ':a': attachmentUrl }
      })
      .promise()
  }

  async generateUploadUrl(todoId) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }

  async generateViewUrl(todoId) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }
}
