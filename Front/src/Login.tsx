// // Login.tsx
// import React from 'react';
import qd_logo from './assets/qd_logo.png';
import LogoImage from './assets/Logo.png';
import GoogleLogo from './assets/GoogleLogo.png';
import Pixie from './assets/Pixie.png';
import Aegeon from './assets/Aegeon.png';
import Nova from './assets/Nova.png';
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
          <button className='GoogleLoginButton'>
            <span className="continue-text">Continue with</span> <img src={GoogleLogo} alt="GoogleLogo" className="GoogleLogo" />
          </button>
          <img src={Pixie} className="Pixie" alt="Pixie" />
          <img src={Aegeon} className="Aegeon" alt="Aegeon" />
          <img src={Nova} className="Nova" alt="Nova" />
      </header>
    </div>
  );
}



export default Login;
