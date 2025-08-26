import { getTodos } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
  const userId = getUserId(event)
  const items = await getTodos(userId)
  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({ items })
  }
}

const cors = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
})
