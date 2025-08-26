import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const newTodo = JSON.parse(event.body || '{}')

  const item = await createTodo(userId, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item })
  }
}
