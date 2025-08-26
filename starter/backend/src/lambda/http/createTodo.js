import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const newTodo = JSON.parse(event.body || '{}')

  if (!newTodo.name || !newTodo.name.trim()) {
    return {
      statusCode: 400,
      headers: cors(),
      body: JSON.stringify({ message: "Field 'name' is required." })
    }
  }

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
