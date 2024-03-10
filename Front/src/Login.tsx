// // Login.tsx
// import React from 'react';
import qd_logo from './assets/qd_logo.png';
import LogoImage from './assets/Logo.png';
import './Login.css';

function Login() {
  return (
    <div className="Login">
      <header className="Login-header">
      <div className="LogIn">
           <p className="LogLine">Log in to Pong Paradise</p>
         </div>
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
          <button className="transparentButton">
            Continue with <img src={qd_logo} alt="Logo" className="logo" />
          </button>
      </header>
    </div>
  );
}



export default Login;
