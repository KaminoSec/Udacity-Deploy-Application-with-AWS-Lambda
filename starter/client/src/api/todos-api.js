import axios from 'axios'
import { apiEndpoint } from '../config.js'

const API = process.env.REACT_APP_API_ENDPOINT || apiEndpoint

export async function getTodos(idToken) {
  const response = await axios.get(`${API}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.items
}

export async function createTodo(accessToken, newTodo) {
  const res = await axios.post(`${apiEndpoint}/todos`, newTodo, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
  return res.data.item
}

export async function patchTodo(accessToken, todoId, updated) {
  await axios.patch(`${apiEndpoint}/todos/${todoId}`, updated, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export async function deleteTodo(accessToken, todoId) {
  await axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function getUploadUrl(accessToken, todoId) {
  const res = await axios.post(
    `${apiEndpoint}/todos/${todoId}/attachment`,
    '',
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  )
  return res.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await axios.put(uploadUrl, file)
}
