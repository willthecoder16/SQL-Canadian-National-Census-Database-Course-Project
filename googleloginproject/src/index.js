import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider} from '@react-oauth/google';
import './index.css';
import './App.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId='327101468590-joflu3ui68k6lu60sou6o5v786in071a.apps.googleusercontent.com'>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </GoogleOAuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
