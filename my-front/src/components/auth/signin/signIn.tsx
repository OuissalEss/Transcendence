import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../../../public/assets/logo.png';
import './signIn.css';

function SignInPage() {
  return (
    <>
      <div className='backgroundImage'></div>
      <div className="overlay bg-pink-300 opacity-50"></div>
      <div className="fixed top-0 left-0 m-4 z-10">
        <img src={logoImage} alt="Logo" className="w-12 h-12 image" />
      </div>
    </>
  );
}

export default SignInPage;