import { v4 as uuidv4 } from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodosAccess()

export async function getTodos(userId) {
  return await todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId, newTodo) {
  const todoId = uuidv4()
  const createdAt = new Date().toISOString()

  const item = {
    userId,
    todoId,
    createdAt,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  }

  await todosAccess.createTodoItem(item)
  return item
}

export async function updateTodo(userId, todoId, updated) {
  await todosAccess.updateTodoItem(userId, todoId, updated)
}

export async function deleteTodo(userId, todoId) {
  await todosAccess.deleteTodoItem(userId, todoId)
}

export async function createAttachmentPresignedUrl(userId, todoId) {
  // Pre-signed PUT URL for the client to upload
  const uploadUrl = await todosAccess.generateUploadUrl(todoId)

  // Also pre-sign a short-lived GET URL and store it so the UI can show the image
  const viewUrl = await todosAccess.generateViewUrl(todoId)
  await todosAccess.updateAttachmentUrl(userId, todoId, viewUrl)

  return uploadUrl
}
