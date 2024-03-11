// components/landing/LandingPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import girlImage from '../../../../public/assets/Characters/Nova/01.png'
import botImage from '../../../../public/assets/Characters/Pixie/01.png'
import logoImage from '../../../../public/assets/logo.png';
import boyImage from '../../../../public/assets/Characters/Aegon/04.png'
import './login.css';

function LogingPage() {
  return (
    <>
	<div className='backgroundImage'></div>
	<div className="overlay bg-pink-300 opacity-50"></div>
	<div className="fixed top-0 left-0 m-4 z-10">
	<img src={logoImage} alt="Logo" className="w-12 h-12 image" />
	</div>
	<div className="fixed top-5 left-10 bottom-0 w-full z-10 flex justify-left items-stretch character-container">
		<img
			src={girlImage}
			alt="character"
			className="w-1/6 sm:w-1/8 md:w-1/8 lg:w-1/5 xl:w-1/6 max-w-full h-auto"
			style={{ marginBottom: '0' }}
		/>
	</div>
	<div className="fixed bottom-0 left-0 w-full z-10 flex justify-center character-container">
		<img
			src={botImage}
			alt="character"
			className="w-1/6 sm:w-1/6 md:w-1/6 lg:w-1/5 xl:w-1/6 max-w-full h-auto"
			style={{ marginBottom: '0' }}
		/>
	</div>
	<div className="fixed inset-y-0 right-0 bottom-0 z-10 flex items-stretch character-container">
		<img
			src={boyImage}
			alt="character"
			className="w-auto sm:w-auto md:w-auto lg:w-auto xl:w-auto h-auto max-w-full"
			style={{ marginBottom: '0' }}
		/>
	</div>
	<div className="text fixed top-20">
        <p className="normalText">Welcome to the chat !</p>
    </div>
	<div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-4">
		<Link to="/signup">
		<div className="b mx-auto h-16 w-64 flex justify-center items-center">
      		<div className="i h-16 w-64 bg-gradient-to-br from-pink-400 to-yellow-600 items-center rounded-full shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out"></div>
			<button className="text-center text-white font-semibold z-10 pointer-events-none">Sign Up</button>
		</div>
		</Link>	
		
		<Link to="/signin">
		<div className="b mx-auto h-16 w-64 flex justify-center items-center">
      		<div className="i h-16 w-64 bg-gradient-to-br from-pink-400 to-yellow-600 items-center rounded-full shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out"></div>
			<button className="text-center text-white font-semibold z-10 pointer-events-none">Sign In</button>
		</div>
		</Link>	
	</div>


    </>
  );
}

export default LogingPage;
