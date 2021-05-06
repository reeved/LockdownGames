import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Auth0Provider
    // Tenant domain and client id are public, not secret.
    // Hence they are placed in plain code and not in an environment file
    domain="lockdown-games.au.auth0.com"
    clientId="CemOI3YZZijvVeFS2GYOY9xfpMss6MHr"
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
