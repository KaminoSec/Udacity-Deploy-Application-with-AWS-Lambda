import { createAttachmentPresignedUrl } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const { todoId } = event.pathParameters || {}
  const uploadUrl = await createAttachmentPresignedUrl(userId, todoId)
  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({ uploadUrl })
  }
}

const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
})
