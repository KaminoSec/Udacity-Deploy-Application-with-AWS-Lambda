import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const { todoId } = event.pathParameters || {}
  await deleteTodo(userId, todoId)
  return { statusCode: 204, headers: cors(), body: '' }
}

const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
})
