import { useState } from 'react';
import '../assets/already_in_game.css'
import '../App.css';

const AlreadyInGame = () => {

    return (
        <div className="containerAIG">
            <div className='flex center'>
                <h1>You are already in another game</h1>
            </div>
        <div>
            <img 
                src='/MickeyMouse.png'
                alt=''
            />
            
        </div>
      </div>
    );
}

export default AlreadyInGame;