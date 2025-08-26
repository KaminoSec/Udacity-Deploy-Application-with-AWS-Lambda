import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

// Prefer env var; fall back to the placeholder if someone forgets.
const jwksUrl =
  process.env.AUTH0_JWKS_URL ||
  'https://test-endpoint.auth0.com/.well-known/jwks.json'
const expectedIssuer = process.env.AUTH0_ISSUER_URL
const expectedAudience = process.env.AUTH0_AUDIENCE

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    // Allow request
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      },
      // Pass through the user id to downstream handlers
      context: {
        principalId: jwtToken.sub
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    // Deny request
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  // Decode without verifying to read the header (to get 'kid')
  const decoded = jsonwebtoken.decode(token, { complete: true })
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid token header')
  }

  // 1) Fetch JWKS
  const jwks = await getJwks()
  // 2) Find the signing key by kid
  const signingKey = jwks.keys.find(
    (k) => k.kid === decoded.header.kid && k.x5c && k.x5c.length
  )
  if (!signingKey) throw new Error('Signing key not found in JWKS')

  // 3) Build PEM cert from x5c
  const cert = certToPEM(signingKey.x5c[0])

  // 4) Verify token
  const verified = jsonwebtoken.verify(token, cert, {
    algorithms: ['RS256'],
    issuer: expectedIssuer,
    audience: expectedAudience
  })

  return verified
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  return token
}

async function getJwks() {
  const resp = await Axios.get(jwksUrl, { timeout: 5000 })
  if (!resp?.data?.keys?.length) throw new Error('JWKS keys not found')
  return resp.data
}

function certToPEM(cert) {
  const wrapped = cert.match(/.{1,64}/g).join('\n')
  return `-----BEGIN CERTIFICATE-----\n${wrapped}\n-----END CERTIFICATE-----\n`
}
