import { useState } from 'react';
import '../assets/loading.css'
import '../App.css';
import Aegon from '/Characters/Stories/Aegon.png'
import Aurora from '/Characters/Stories/Aurora.png'
import Lumina from '/Characters/Stories/Lumina.png'
import Luna from '/Characters/Stories/Luna.png'
import Nova from '/Characters/Stories/Nova.png'
import Starlight from '/Characters/Stories/Starlight.png'
import Pixie from '/Characters/Stories/Pixie.png'
import All from '/Characters/Stories/All.png'

const GameLoading = () => {
    const [previousStoryIndex, setPreviousStoryIndex] = useState(7);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [nextStoryIndex, setNextStoryIndex] = useState(1);
    const stories = [Aegon, Aurora, Lumina, Luna, Nova, Starlight, Pixie, All];

    const handlePrevStory = () => {
        const newIndex = currentStoryIndex === 0 ? stories.length - 1 : currentStoryIndex - 1;
        let prev = newIndex - 1;
        if (prev == -1)
            prev = 7;
        setPreviousStoryIndex(prev);
        setCurrentStoryIndex(newIndex);
        setNextStoryIndex((newIndex + 1) % stories.length);
    };
    
    const handleNextStory = () => {
        const newIndex = (currentStoryIndex + 1) % stories.length;
        setPreviousStoryIndex(currentStoryIndex);
        setCurrentStoryIndex(newIndex);
        setNextStoryIndex((newIndex + 1) % stories.length);
    };
    
    return (
        <div className="container p-6" >
            <div className="grid grid-cols-4 gap-8">
                <div className="col-span-1">
                    <div className="gif">
                        <img
                            width="400"
                            height="400"
                            className="image"
                            src="/loading.gif"
                            alt="Loading"
                            referrerPolicy="no-referrer"
                        />
                        <h1 className="text-loading">Your next challenge is loading!!</h1>
                        <p className="par"> Meanwhile, discover our characters' captivating stories.</p>
                    </div>
                </div>
                <div className="stories col-span-3">
                    <div className='images flex'>
                        <img src={stories[previousStoryIndex]} className="previous_storie" onClick={handlePrevStory} alt="stories" referrerPolicy="no-referrer"/>
                        <img src={stories[currentStoryIndex]} className="current_storie" alt="stories" referrerPolicy="no-referrer"/>
                        <img src={stories[nextStoryIndex]} className="next_stories" onClick={handleNextStory} alt="stories" referrerPolicy="no-referrer"/>
                    </div>

                    <span></span>
                </div>

            </div>
        </div>
        );
}

export default GameLoading;