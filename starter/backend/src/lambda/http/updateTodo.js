import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const { todoId } = event.pathParameters || {}
  const req = JSON.parse(event.body || '{}')
  await updateTodo(userId, todoId, req)
  return { statusCode: 204, headers: cors(), body: '' }
}

const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
})
