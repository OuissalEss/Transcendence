// components/landing/LandingPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import girlImage from '../../../public/assets/Girl.png';
import logoImage from '../../../public/assets/logo.png';
import titleImage from '../../../public/assets/Title.png';
import './landing.css';

function LandingPage() {
  return (
    <>
      <div className="fixed top-0 right-0 z-10">
        <img
          src={girlImage}
          alt="Your Character"
          className="object-cover h-auto sm:h-auto md:h-screen lg:h-screen xl:h-screen"
        />
      </div>
      <div className="fixed top-1/2 -translate-y-1/2 left-12 z-10">
        <img
          src={titleImage}
          alt="Your Image"
          className="w-100 h-72"
          style={{ top: "40%", transform: "translateY(-50%)" }}
        />
      </div>
	  <div className="textContainer">
        <p className="titleText">Bounce into Brilliance:</p>
        <p className="normalText">Your Destination for Ping Pong Excitement!</p>
      </div>
      <div className="fixed bottom-5 left-24 m-24 z-10">
        <Link to="/login">
          <button
            className="text-white py-3 px-10 rounded inline-flex items-center button"
            style={{ backgroundColor: "#3E1256" }}
          >
            Get Started
          </button>
        </Link>
      </div>
    </>
  );
}

export default LandingPage;
