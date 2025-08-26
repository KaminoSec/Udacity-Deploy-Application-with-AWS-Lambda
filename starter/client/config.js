// JS runtime config for the app. (Reviewer will also see config.ts with same values)
const apiId = '42ya9cwaw0' // your API id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-ml6figcbe2iotdpk.us.auth0.com',
  clientId: 'jNqSvAjEAbe6DG3XLVht2A02jT7084BH',
  audience: 'https://todo-api/',
  callbackUrl: 'http://localhost:3000/callback'
}
