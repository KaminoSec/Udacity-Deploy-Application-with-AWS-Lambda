import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import './index.css'
import { authConfig } from './config.js'

const domain = process.env.REACT_APP_AUTH0_DOMAIN || authConfig.domain
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || authConfig.clientId
const redirectUri = process.env.REACT_APP_CALLBACK_URL || authConfig.callbackUrl

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={redirectUri} // v1 prop
    audience={authConfig.audience} // v1 prop
    scope="openid profile email" // v1 prop
    cacheLocation="localstorage"
    useRefreshTokens
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
)
