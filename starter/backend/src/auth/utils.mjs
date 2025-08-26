import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

// Prefer the principalId set by the custom authorizer.
// Fallback to decoding the JWT from the Authorization header.
export function getUserId(event) {
  const fromAuthorizer = event?.requestContext?.authorizer?.principalId
  if (fromAuthorizer) return fromAuthorizer

  const authHeader =
    event?.headers?.Authorization || event?.headers?.authorization
  if (!authHeader) throw new Error('No authentication header')

  const [scheme, token] = authHeader.split(' ')
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    throw new Error('Invalid authentication header')
  }

  const decoded = jsonwebtoken.decode(token)
  if (!decoded || !decoded.sub) throw new Error('Invalid JWT')
  return decoded.sub
}
